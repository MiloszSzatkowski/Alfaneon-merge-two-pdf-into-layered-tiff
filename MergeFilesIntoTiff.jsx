// CS6

var pluginName = "Eyelets";

// enable double clicking from the Macintosh Finder or the Windows Explorer
#target photoshop

// debug level: 0-2 (0:disable, 1:break on error, 2:break at beginning)
$.level = 0;
//debugger; // launch debugger on next line

// on localized builds we pull the $$$/Strings from a .dat file, see documentation for more details
$.localize = true;

var gScriptResult;

//open config
var b = new File((new File($.fileName)).parent + "/Config/inputFolder.txt");
var inputPaths = "";
b.open('r');
while(!b.eof) inputPaths += b.readln();
b.close();

var f1 = new File((new File($.fileName)).parent + "/Config/firstType.txt");
var firstType = "";
f1.open('r');
while(!f1.eof) firstType += f1.readln();
f1.close();

var f2 = new File((new File($.fileName)).parent + "/Config/secondType.txt");
var secondType = "";
f2.open('r');
while(!f2.eof) secondType += f2.readln();
f2.close();

var c = new File((new File($.fileName)).parent + "/Config/outputFolder.txt");
var outputFolder = "";
c.open('r');
while(!c.eof) outputFolder += c.readln();
c.close();
outputFolder = new Folder(outputFolder);

//close config

var samplesFolder = new Folder(inputPaths);

//Get the files
var fileList = samplesFolder.getFiles();

//prepare the names - erase all spaces and lowdashes
// = File.openDialog( 'select your AI file…' );
var myfile;
var wipeThat;
for (var o = 0; o < fileList.length; o++) {
  myfile = fileList[o];
  wipeThat = myfile.name.replace(/%|_|[+ -]|20|only/g,'@');
  myfile.rename(wipeThat.replace(/@/g,'' ));
}

//create object holding values for name
function FileNameObj (pathOfFile, fullName, restConcat, type, pair){
 this.path = pathOfFile;
 this.fullName = fullName;
 this.compareName = restConcat;
 this.type = type;
 this.pair = pair;
}

function ContainsThis(string,lookfor){
  if(string.indexOf(lookfor) !== -1){
  return true;
  } else {
  return false;
  }
}

var rTarr = [];
var TTarr = [];
var pass;

function removeType (_string, para1, para2){
  if (ContainsThis(_string, para1)) {
    pass =  para1;
  } else {
    pass = para2;
  }
   rTarr = _string.replace(pass,"#"+pass+"#").split("#");
   return rTarr[0] + rTarr[2];
}

function gimmeType (_string, para1, para2){
  if (ContainsThis(_string, para1)) {
    pass =  para1;
  } else {
    pass = para2;
  }
   rTarr = _string.replace(pass,"#"+pass+"#").split("#");
   return rTarr[1];
}

//Creat Array to hold names
var inputNames = [];

for (var i = 0; i < fileList.length; i++) {
  inputNames[i] = new FileNameObj(
    // fileList[i].toString().replace(/\\/g, '/'),
    fileList[i],
    fileList[i].name,
    removeType(fileList[i].name, firstType, secondType),
    gimmeType (fileList[i].name, firstType, secondType),
    "temp"
  );
}

// alert(inputNames[0].compareName);
// alert(inputNames[2].compareName);

function lookForDuplicate(array,indexOfElement){
  for (var g = 0; g < array.length; g++){
    if (array[indexOfElement].compareName==array[g].compareName
     && g!==indexOfElement) {
      return array[g].path;
      break;
    }
  }
}

if (inputNames.length%2===0) {
  for (var j = 0; j < inputNames.length; j++) {
    inputNames[j].pair = lookForDuplicate(inputNames,j);
  }
} else {
  alert("W katalogu jest nieparzysta liczba plików. || There is uneven number of files in the input folder.");
}

//all of object have their pairs
// OPEN SCRIPT !

// app.preferences.rulerUnits = Units.CM;
app.displayDialogs = DialogModes.NO;

var pdfOpenOptions = new PDFOpenOptions();

pdfOpenOptions.antiAlias = true;
pdfOpenOptions.mode = OpenDocumentMode.CMYK;
pdfOpenOptions.bitsPerChannel = BitsPerChannelType.EIGHT;

pdfOpenOptions.resolution = 100;
pdfOpenOptions.supressWarnings = true;
pdfOpenOptions.cropPage = CropToType.TRIMBOX;

var new_layer_from_file;
var new_background_from_file;
var Path;

for (var i = 0; i < inputNames.length; i++) {
  if (inputNames[i].type==firstType) {
    new_background_from_file = open(inputNames[i].path, pdfOpenOptions);
    app.activeDocument.activeLayer.name = inputNames[i].compareName;
    new_layer_from_file = open(inputNames[i].pair, pdfOpenOptions);
    new_layer_from_file.selection.selectAll();
    new_layer_from_file.selection.copy();
    new_layer_from_file.close(SaveOptions.DONOTSAVECHANGES);
    app.activeDocument = new_background_from_file;
    new_background_from_file.paste();
    app.activeDocument.activeLayer.name = inputNames[i].compareName;
    app.activeDocument.flatten();
    Filename = app.activeLayer.name.replace(/\./g, '');
    SaveTIFF(new File("C:/Users/miopu/Desktop/Coding/Photoshop/Alfaneon-combine-two-pdfs-into-layered-tiff/Files for testing/output" + "/" + "ads.tif"));
    break;
    app.activeDocument.close(SaveOptions.DONOTSAVECHANGES);
  }
}

function SaveTIFF(saveFile){
  tiffSaveOptions = new TiffSaveOptions();
  tiffSaveOptions.embedColorProfile = true;
  tiffSaveOptions.alphaChannels = true;
  tiffSaveOptions.layers = true;
  tiffSaveOptions.imageCompression = TIFFEncoding.TIFFLZW;
  app.activeDocument.saveAs(saveFile, tiffSaveOptions, true, Extension.LOWERCASE);
}

















// function isOdd  (x) { return x & 1; };
// function isEven (x) { return !( x & 1 ); };
// function isZero (x) { return ((x === 0) ? true : false)};
// function isNotZero (x) { return ((x === 0) ? false : true)};
