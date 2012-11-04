(function() {

	// Check for the various File API support.
	if(window.File && window.FileReader && window.FileList && window.Blob) {
		// Great success! All the File APIs are supported.
	} else {
		alert('The File APIs are not fully supported in this browser.');
	}


	function toArray(list) {
		return Array.prototype.map.call(list, function(item) {
			return item;
		});
	}

	function spritesLoaded(sprites) {

		var count = sprites.length;

		// assume that all sprites have the same dimensions
		var width = sprites[0].width;
		var height = sprites[0].height;

		// these could come from settings
		var rows = Math.ceil(Math.sqrt(count));
		var cols = rows;

		var canvas = document.createElement('canvas');
		canvas.height = rows * height;
		canvas.width = cols * width;

		var ctx = canvas.getContext('2d');

		sprites.forEach(function(sprite, index) {
			var x = (index % cols) * width;
			var y = Math.floor(index / rows) * height;
			ctx.drawImage(sprite, x, y)
		});

		var dataUrl = canvas.toDataURL('image/png');

		var sheet = new Image();
		sheet.src = dataUrl;
		document.querySelector('section[role=output]').appendChild(sheet);
	}

	function filesLoaded(evt) {
		var sprites = [];

		var fileList = evt.target.files; // FileList object
		var files = toArray(fileList);

		// filter out non-image files
		var images = files.filter(function(file) {
			return file.type.match('image.*');
		});

		var len = images.length;

		// read the file and load the image
		images.forEach(function(file, index) {

			var reader = new FileReader();

			reader.addEventListener('load', function(e) {
				var img = new Image();
				img.src = e.target.result;
				img.addEventListener('load', function() {
					sprites[index] = img;
					len--;
					if(len === 0) {
						spritesLoaded(sprites)
					}
				});
			});

			reader.readAsDataURL(file);
		});
	}

	document.getElementById('files').addEventListener('change', filesLoaded, false);

}());