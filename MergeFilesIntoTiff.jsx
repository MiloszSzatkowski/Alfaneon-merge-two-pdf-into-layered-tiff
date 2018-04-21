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
    fileList[i].toString().replace(/\\/g, '/'),
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
    if (array[indexOfElement].compareName==array[g].compareName) {
      return array[g].path;
      break;
    }
  }
}

if (inputNames.length%2===0) {
  for (var j = 0; j < inputNames.length; j++) {
    inputNames.pair = lookForDuplicate(inputNames,j);
  }
} else {
  alert("W katalogu jest nieparzysta liczba plików. || There is uneven number of files in the input folder.");
}


alert(inputNames[0].pair + "         " + inputNames[2].pair);

// OPEN SCRIPT !
























// function isOdd  (x) { return x & 1; };
// function isEven (x) { return !( x & 1 ); };
// function isZero (x) { return ((x === 0) ? true : false)};
// function isNotZero (x) { return ((x === 0) ? false : true)};
