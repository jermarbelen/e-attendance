# Changelog
All notable changes to this project will be documented in this file.

## [Unreleased] - 2023

- add graphs ui on dashboard
- add new database of central office issuances beta
- add new database of office orders beta
- add new categories on action would only be IN, OUT, ACTED-UPON, UPLOADED, OUTGOING
- add if a document is entered beyond 20 days and not categorized as 'ACTED-UPON' by records section or concerned office, show warning as pending
- add pending summary report can be generated, except tagged by an office as 'Acted-upon' in progress note
- add new category that indicate a new document as CC
- add cc report for ORED [milner macarandang]
- addded QRcode generator and verification for e-signatures

## DATS 5.16.2 - 2023-08-04
- edit print_dats.php; removed for aa and document type
- pushed to github repo, fu

## DATS 5.16.1 - 2023-05-15
- edit disabled edit action date and received date in edit_action.php
- remove delete function on edit_action.php
- added HIDDEN option on status on edit_action.php (buggy)

## DATS 5.15.3 - 2023-05-08
- new server configuration
- restoration of backup

## DATS 5.15.2 - 2023-03-10
- added Voucher and Travel order category on new document

- uploaded new QMS policy on dashboard 

## DATS 5.15.1 - 2022-09-29
- fix search_my_docuemts.php replaced AND with OR in SQL

## DATS 5.15.1a - 2022-03-01
- new management agreements on last meeting as of 2022-03
- all documents shall be encoded on the system, including internal and documents that will not be released outside the Regional office (PENRO/CENRO)
- all incoming and official documents will be encoded by the Records Section
- signed or unsigned advance copies from field offices should be emailed to mimaroparegion@denr.gov.ph
- if a document is addressed to an employee but the delivery address is the office, it will be considered official and will be encoded to the system, except noted as confidential or c/o
- scanned copies are accepted by the ff divisions: Legal, Finance, PMD, NGP
- scanned copies are accepted but with some exceptions by the ff divisions: Administrative Division
- only original documents are accepted by the ff divisions: SMD, CDD, LPDD
- final actions should be added or updated by the first concern office to the system
- the Records Section will handle releasing of all documents 
- GSS will coordinate a M.O.A with courier companies re: outgoing documents
- all email attachments won’t be printed but would be uploaded by the concern office to the system and will be available for viewing for all divisions
- reference number(s) of other tracking systems will be included on the subject to our system. eg. subject(ref:001)
- updated categories on the add_document_action.php form will only be IN, OUT, ACTED-UPON, UPLOADED, OUTGOING
- if a document entry date goes beyond 20 days and not tagged as 'ACTED-UPON' by the Records Section or the concerned office, the system will show a warning of how many days it was pending and a summary report can be generated
- a new 'CC' tag will be introduced to documents going to ORED
- generate a report that can also be used as an offline backup
- the new process flows will be implemented

## DATS 5.15.0 - 2022-02

- add document number on attachment icon[milner macarandang]
- fix update error on travel order number
- add new database of memo-circular database beta
- add new database of memorandum database beta
- add summary of service reports based on PNERO MRDQ Template
- add new and centralized notification/messaging system
- add private messaging on new notification system
- fix group messaging and decending order
- add search employee on notif system
- modified group notifications on messenger app on denris

## DATS 5.15.0 - 2021-12

- add memorandum order database
- add "Records" option on Addressee menu on add_email.php
- fix show download error when no attachemnt is uploaded
- remove auto generated progress note from ict
- fix the notification, now every employee from the notified group can see and add action
- add links to register and system directory 
- fix the auto generated progress from Records section
- fix document now requires subject, attachment, senders address
- add add progress note link from print users entry report

## DATS 5.15.0 - 2021-10

- add changelog view on homepage
- add view of actions and details while adding action/progress
- add notifications for divisions/sections action
- add document number on top of view progress.php (glo galima)
- add auto progress if document is outgoing from records to CO (mitch tuyan)
- change links to older systems
- fix missing donwload links from RSO and Travel Orders (mitch tuyan)
- fix css highlight on page currecntly active  (janice belen)
- change notification trigger from "addresee" to "refered to" 
- fix menu links arrangement  on legacy view
- optimized non-barcoded documents list, action directly goes to barcoding
- optimized travel order view if download attachemnt is not available
- remove non working links on property management system
- fix denied error not showing proper css
- remove download attachments on old dats to prevent issues
- added sections list on add action
- add filter on view documents

## DATS 5.14.0 - 2021-06

- add document number on email inbox (by milner acarandang)
- add bell icon color changes to yellow (by malco canonio)
- fix critical security (by liza cabrera)
- add ckEditor on html file edit
- update context menu (by kai tanada)
- fix upload an image with malicius code inside
- added compatibility with memory_limit expressed in G
- fix relative url return
- fix error on file duplication
- fix error with memory usage (by jdbelen)
- fix a vulnerability on url upload (by donot-wong)
- fix return on upload in same cases
- other fixes (by all)

## DATS 5.13.4

- fix Directory Traversal Allows to Read Any File
- fix Path Traversal While Upacking Archives
- Fix foreach warning on URL upload
- Fix http https URL upload
- add toggle on config for extract_files
- prevent image creation for broken links in URL upload (by davodavodavo3)
- Migrate to yarn on development (by mklkj)
- code refactoring

## DATS 5.13.3

- support to files without extension
- fix Path Traversal vulnerability and url validation
- fix vulnerability that permits to see server files
- fix double file and folder rename
- refactoring
- update Hungarian, German and Thai languages
- fix nested php tags in download permission
- change jPlayer script to cdn

## DATS 5.13.2

- empty filename support (like .htaccess, .env,...)
- fix download bug
- refactoring check extension

## DATS 5.13.1

- folder creation fix
- blacklist fix
- php < 5.6 compatibility fix

## DATS 5.13.0

- multiple file selection: you can delete multiple files, you can select multiple file (n.b. if you select multiple files on stand alone mode it return a json list of urls, if you use editor with normal mode return only the first and if you use tinymce with responsivefilemanager plugin return all files on editor)
- you can disable mime type renaming on config
- blacklist extensions available on config
- fixed precompiled test on duplication
- DATS remember the last folder when return to filemanager
- added mime type .rar
- fixed folder permission to get config value
- fixed an error on folder renaming
- a lot of others bugs fixed

## DATS 5.12.2

- fixed a security vulnerability (by sashaptrw)
- fixed other minor problems

## DATS 5.12.1

- fix FTP support
- fix problem with subfolder session

## DATS 5.12.0

- fixed multiple security vulnerabilities (by Ryan Dewhurst - BSc Ethical Hacking for Computer Security, CCNA)
- fixed lazy loading problems with a new plugin
- copy url without flash with clipboard.js
- removed java uploader and introduce new upload system with canucks part
- new upload method with jQuery-File-Upload
- removed viewer_js and substituted with google preview
- fix problem with url upload
- multiple files, folder upload permission also WITH RECURSIVE FOLDER UPLOAD
- fix the config.php inclusion on subfolders see CUSTOMISE CONFIGURATION FOR EACH FOLDER on documentation
- RTL stylesheet on repository (if you want to use simply include on dialog.php)
- you can now drop files/folders everywhere to upload

## DATS 5.11.3

- fixed multiple security vulnerabilities (by Wiswat Aswamenakul (Nick))
- url upload toggle
- fixed upload xml
- prettify improvement
- added cad preview
- other minor bug fixes

## DATS 5.11.0

- fixed multiple security vulnerabilities (by CERT-W and Davide Girardi from Outpost24)
- Add FTP beta support
- Upload from URL
- Add watermark on images
- fixed problem with some file type on upload
- fixed a problem with change language
- fixed a problem with rename
- fixed a problem with upload mine type
- fixed memory_error bool indicator
- add configuration to add &time to image to prevent chaching
- other fixes


## DATS 5.10.2

- fixed Download of large file
- added pause resume download
- fixed problem with base_url function
- removed set_time_limit call


## DATS 5.10.1

- now you can pass available extensions list in url (ex. you can show only excel files)
- fixed a problem with php<5.3
- remember filter and sort after refresh
- added config toggle to show/hide filter buttons and language selection button
- fixed a problem when you click on namefile label (previously was equal to click two times)
- fixed a problem with relative path with folder (by gordon-matt)
- fixed a problem with mimetype in some cases
- fixed a problem with cache on image editor include
- fixed a problem with + char on folders name


## DATS 5.10.0

- added total max size control to limit the size of all files into
source folder (you can control it in config.php) (by Stephane MERCIER)
- improved the error messages (by Stephane MERCIER)
- update jplayer
- fixed a incorrect closing of upload modal
- fixed lowercase on convert_spaces active and add lower_case option on config.php
- add mimetype control on upload (ex. if i renane img.jpg to img.pdf and upload to filemananger the system check the time type and converte it to img.jpg)
- fixed permission error on files and folders
- other fix



## DATS 5.9.7

- fixed pdf preview
- fixed a bug with session subfolder folder creation
- fixed a bug with folder creation
- fixed a problem with ie and allow_url_fopen server config
- fixed a problem with folder copy
- fixed a problem with relative folder url export
- fixed error 'TypeError: $ is not a function'
- fixed a problem with lang in query string
- fixed a problem with drag&drop on android


## DATS 5.9.6

- fixed a security vulnerability (by securitum.pl)
- code refactoring removed thumb path to ajax calls
- improve file/folder permission layout and fixed a error
- fixed a problem with image editor
- added vitnamese language



## DATS 5.9.5

- fixed a Adobe Creative SDK issue
- fixed a problem when you edit multiple image in the same session
- fixed a problem with security issue in some server configurations
- added maxSize config to Adobe Creative SDK export image (default now is 1400)



## DATS 5.9.4

- Upgrade Aviary Image Editor with new Adobe Creative SDK without size limitation
- Add files and folders counter on each folder
- Fixed a problem with folder selection on relative url


## DATS 5.9.3

- Fixed the problem with undefined windowParent
- Fixed a problem with selection on CKeditor
- Added bootstrap modal default support


## DATS 5.9.2

- added file selection directly from dropzone upload area (you can now select file directly after upload)
- folder selection in context menu (you can now select also a folder)
- responsive filemanager modal open on tinyMCE (the dimension of modal depend on window dimension)
- utf8 translitteration fix


## DATS 5.9.1

- bugfix


## DATS 5.9.0

- add compatibility with CKEditor (by dennis.buijs)
- fix ordering and filtering bugs (in js and php)
- Refactoring of configuration and language files (by rkgrep)
- updated libraries via bower dependency management (by rkgrep)
- added Assets compilation via gulp for developing (by rkgrep)
- added Hebrew lang (sagie212)



## DATS 5.8.1

- add compatibility with free full resolution with aviary image editor
- convert all include(); with include ‘’;
- fix a problem with lowercase automatically change 


## DATS 5.8

- added pdf, openoffice files preview with customized viewer.js
- added other office file preview with google preview
- fixed ordering bug
- improved layout style
- added copy to clipboard button on show url dialog
- fixed a bug when download a file
- fixed a bug in relative path images creation
- adding custom convert_spaces [by fungio]


## DATS 5.7.4
- minimum 1,000 subscribers
- at least of 4,000 valid public watch hours over the last 12 months
- adsense account linked to your channel
- does not have any active community guidelines strikes
- followed all channel monetization policies
- use 2-step verification on the google account associated with your channel for an extra layer of security

## DATS 5.7.3

- Fix a problem with lazy load and filters
- add option to remember text filter in session


## DATS 5.7.2


## ## Major ## ## - Added mime type lib for downloads
- Added lazy loading feature
- Added options for auto and max image resizing
- Lang. updates
- Added touch devices support for drag&drop
- Added support for returning relative URL-s
- Bugfixes


## ## Detailed ## ## - Added mime type lib for downloads
	All downloads no should load successfuly

- Added lazy loading feature
	Images will only load when in the viewport so when you are in a crowded folder it will load faster

- Added options for auto and max image resizing
	In the past all images that was resized either with max_image or auto resize was cropped.
	Now the user can specify to crop,exact,landscape or portrait options.
	The max image size can be overridden by auto resize option

- Added support for returning relative URL-s
	Relative URL-s can be returned when selecting files from the filemanager: a 'relative_url' GET parameter should be
	added to the request with a value of "1" when opening DATS. Otherwise returned URL-s will be absolute.

- Bugfixes
	Fixed css bugs
	Fixed drag&drop bugs
	Removed 'default' access keys for security



## DATS 5.6.0


## ## Major ## ## - Cross domain feature
- Add in config.php a option to replace all spaces with _
- Encoding of Export URL
- Code refactoring


## ## Detailed ## ## - Cross domain feature:To enable cross-domain file selector, where files are hosted on one server (for example, serverA.com) and URL is being sent to another (for example, serverB.com), include crossdomain=1 in the URL.
For example, to instantiate image picker, use the following URL:http://serverA.com/[path to filemanager]/filemanager/dialog.php?type=1&field_id=fieldID&crossdomain=1
Then on serverB.com, the following code can be used to retrieve the URL after file selection is made. Please note, that the code is written for jQuery with FancyBox plug-in.

//
// Handles message from ResponsiveFilemanager
//
function OnMessage(e){
  var event = e.originalEvent;
   // Make sure the sender of the event is trusted
   if(event.data.sender === 'responsivefilemanager'){
      if(event.data.field_id){
      	var fieldID=event.data.field_id;
      	var url=event.data.url;
	$('#'+fieldID).val(url).trigger('change');
	$.fancybox.close();

	// Delete handler of the message from ResponsiveFilemanager
	$(window).off('message', OnMessage);
      }
   }
}

// Handler for a message from ResponsiveFilemanager
$(‘.opener-class).on('click',function(){
  $(window).on('message', OnMessage);
});


FILE MANAGER AS TINYMCE PLUG-IN
There is extra parameter needed filemanager_crossdomain when calling tinymce.init(), please see below.
tinymce.init({
   ...
   filemanager_crossdomain: true,
   external_filemanager_path:"http://path/secondaryserver/filemanager/",
    external_plugins: { "filemanager" : "http://path/secondaryserver/filemanager/plugin.min.js"},
   ...
});


- Convert_spaces options: enable the conversion of spaces to _ in file and folder name



## DATS 5.5.0


## ## Major ## ## - File permission changing
- Language Changing
- View/edit/create text files
- Fixes

NOTE: Changed upload button's icon!

## ## Detailed ## ## - File permission changing (OFF BY DEFAULT!)
	Now you can change the files/folders permission with a slick window.
	To access the window first you must activate it in the config file.
	After you activated it you can reach it from the rigth click menu.
	You can configure the permission with both text and checkboxes.
	If you entered a wrong format/number the initial state will be restored.
	When changing permissions for folders there will be more options for
	recursive changing (No/only files/only folders/both).
	If you set the permission wrong there will be errors.

	NOTE! If you don't know what you are doing then leave as it is bacause
	you can cause trouble.
	Usually files are 644 and folders are 755
	You CANNOT set the sticky bit!

- Language Changing
	You can now change the language dynamicly from the menu.
	The button is located next to the refresh button (a globe icon)
	
	If adding new language, it should be added to the languages.php file as 
	well for it to show up.
	
	I tried to identify all language codes and add the name on there own
	language but I might messed up so please check it and correct it if
	necessary. (Because I'm only a human and speak only 2 languages)

- View/edit/create text files
	You can now view/edit/create text based files like .txt.

	To view a file's content just click on the preview (eye) icon.
	To edit a file rigth click on it and select "Edit file's content"
	To create a new file just click on the "+ file" icon (old upload button)

	When creating a new file you must specify it's extension.
	All valid extensions for edit/create are listed in the config file
	($editable_text_file_exts)

- Fixes
	Fixed some css overflow errors
	Removed lang_View from menu because it was overflowing
	Removed hr.php lang because it's the same as hr_HR.php
	Changed upload buttons icon to accomodate the "new file" addition


## DATS 5.4.1


## ## Major ## ## - Security Access Keys
- More Tinymce settings
- Tinymce 3.## support
- Added image resize options
- Bugfixes


## ## Detailed ## ## - Security Access Keys
	If 'USE_ACCESS_KEYS' are set to true only those will access RF whose url
	contains the access key (akey)

	Allowed access keys are defined in the config as well.
	$access_keys must be an array so you can add multiple.
	Your access key should NEVER be 'key' and keep in mind they are CASE
	SENSITIVE!
	For recommended key generation read the comments in the config file.

	If there's no access key supplied with the url or it's not in the
	$access_key array you will get 'Access Denied' and you cannot continue.

	For tinymce a new variable was added: "filemanager_access_key"

	Tinymce config example:

	tinyinit
	...
	external_filemanager_path:"../filemanager",
	filemanager_access_key: "myPrivateKey",
	...

	This is a bit of additional security so no one can access your filesystem.

- More Tinymce settings
	- Added 'filemanager_subfolder' param so you can now define the starting folder in tinymce
  	eg: 'filemanager_subfolder:"subfolder/"'

- Bugfixes
	- Fixed audio/video player bug
	- Fix in remember last position
	- Show url context link in all files and folder
	- Fixed a problem with old thumbnails on renaming
	- Fixed a copy past issue
	- Fixed Standalone Mode not using the field_id passed in mixed use cases