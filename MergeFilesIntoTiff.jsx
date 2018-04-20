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

//create object holding values for name
function FileNameObj (pathOfFile, fullName, restConcat, type){
 this.path = pathOfFile;
 this.fullName = fullName;
 this.compareName = restConcat;
 this.type = type;
}

var rTarr = [];
function removeType (_string, para1, para2){
   rTarr = _string.replace(para1,para2).split("#");
   return rTarr[0] + rTarr[2];
}

var TTarr = [];
function gimmeType (_string, para1, para2){
  TTarr = _string.replace(para1,para2).split("#");
  return rTarr[1];
}

//Creat Array to hold names
var inputNames = [];

for (var i = 0; i < fileList.length; i++) {
  inputNames[i] = new FileNameObj(
    fileList[i].toString().replace(/\\/g, '/'),
    fileList[i].name,
    removeType(fileList[i].name, firstType, "#"+firstType+"#"),
    gimmeType (fileList[i].name, secondType, "#"+secondType+"#")
  );
}

//explode string on spaces and dashes



// OPEN SCRIPT !