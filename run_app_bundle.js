var DETECTIBLE_PLATFORM_EXECUTABLE_EXTENSIONS = [
  // Windows native
  'exe', 'com', 'scr',

  // Java VM
  'jar',

  // ActionScript VM
  'swf',

  // VMWare VM
  'vmx',

  // Various common emulation formats
  'sfc', 'smc', 'nes', 'gb', 'gbc', 'gba', 'v64', 'z64'
];


var fs = new ActiveXObject("Scripting.FileSystemObject");
var shell = new ActiveXObject("WScript.Shell");
var app = new ActiveXObject("Shell.Application");

function include(script_rel_path) {
  var script_abs_path = fs.GetParentFolderName(WScript.ScriptFullName) + "\\" + script_rel_path + ".js";
  var script_text = fs.OpenTextFile(script_abs_path, 1).ReadAll();
  return eval(script_text);
}

function load(script_abs_path) {
  var script_text = fs.OpenTextFile(script_abs_path, 1).ReadAll();
  return eval(script_text);
}

function toArray(enumerable) {
	var a = [];
	var e = new Enumerator(enumerable);

	for(; !e.atEnd(); e.moveNext()) {
		a.push(e.item());
	}

	return a;
}

function RouteSet() {
	function Route(match_fn, callback) {
		this._match_fn = match_fn;
		this._callback = callback;

		this.proposesActionFor = function(obj) {
			if(this._match_fn(obj)) {
				return this._callback;
			} else {
				return null;
			}
		}
	}

	var routes = [];

	this.addRoute = function(match_fn, callback) {
		var route = new Route(match_fn, callback);
		routes.push(route);
	}

	this.routeToFirstMatch = function(test_list) {
		for(var i = 0; i < routes.length; i++) {
			var route = routes[i];

			for(var j = 0; j < test_list.length; j++) {
				var test_obj = test_list[j];
				var action = null;

				if(action = route.proposesActionFor(test_obj)) {
					return action(test_obj);
				}
			}
		}
	}
}

function filenameMatches(pattern) {
	return function(obj) {
		if(!((typeof obj === 'object') && ('Name' in obj))) {
			return false;
		}

		return obj.Name.match(pattern);
	};
}

var defaultRoute = function() { return true; };

var isPlatformExecutable = (function() {
	var pattern = new RegExp('\\.(' + DETECTIBLE_PLATFORM_EXECUTABLE_EXTENSIONS.join('|') + ')$', 'i');
	return function(obj) {
		return obj.Name.match(pattern);
	}
})();




var router = new RouteSet();

router.addRoute(filenameMatches(/^(run|start)\.(exe|vbs|js|wsf|bat|cmd|lnk)$/i), function(f) {
	app.ShellExecute(f.Path, '', f.ParentFolder.Path, 'open', 1);
});

router.addRoute(isPlatformExecutable, function(f) {
	app.ShellExecute(f.Path, '', f.ParentFolder.Path, 'open', 1);
})

router.addRoute(defaultRoute, function(f) {
	app.ShellExecute('explorer.exe', '/root,"' + f.ParentFolder.Path + '"', f.ParentFolder.ParentFolder.Path, 'open', 1);
//	WSH.Echo("Invalid application bundle");
})





var app_bundle = fs.GetFolder(WScript.Arguments.Item(0));
router.routeToFirstMatch(toArray(app_bundle.Files));
