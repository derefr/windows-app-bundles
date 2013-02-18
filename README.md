# Introduction and Installation

The included script, `run_app_bundle.js`, is a Windows Scripting Host script, meant to be used with [kaijuu](http://byuu.org/programming/kaijuu/). Associate the script with all folders ending in ".app", as so:

![](https://raw.github.com/derefr/windows-app-bundles/master/association_setup.png)

And then you'll have something like [Application Bundles](http://en.wikipedia.org/wiki/Application_bundle) in Windows. Double-click an .app directory to "run" it; right-click and then choose "Open" to modify the contents.

# How it works

1. The script will first try to find another script (`.vbs`, `.js`, `.wsf`, etc.) or a shortcut (`.lnk`) in the directory, with the name `start` or `run`. If it finds one of these, it will then execute that script/link, with the .app directory as its working directory.
2. Otherwise, if there is a program (or a file that acts like a program when run under a platform VM, like `.jar` files with Java, `.swf` files with Flash, `.vmx` files with VMWare, `.smc` files with a Super Nintendo emulator, etc.) within your .app directory, then the script will automatically execute that file, using the normal file association Windows has given the file type. (So, if you want a portable .app directory that runs a `.jar`, you should probably write a `start.js` script to run it, instead of relying on Windows to have a `.jar` file association set up!)
3. Otherwise, if neither of the above holds, it will just open the directory for you to view.
