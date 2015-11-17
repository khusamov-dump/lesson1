var http = require("http");
var fs = require("fs"), sys = require("sys");


var requestHandler = function(request, response) {
	
	var status = 200;
	var content;
	
	if (request.url == "/") {
		content = "Вы попали на первую страницу сайта";
	} else if (request.url == "/page1/") {
		content = "<form method='post' action='/page2/' enctype='multipart/form-data'>\
		<input name='file1' type='file'><input type='submit' value='Отправить'></form>";
	} else if (request.url == "/page2/") {
		content = "Файл принят!";
		
		
		
		var data = '';
		
		request.on('data', function(chunk) {
		    data = data + chunk;
		  });
		  
		request.on('end', function() {
		    console.log('POST data: %s', data);
		    
		    fs.open("temp.txt", "w", 0777, function(err, dataFile) {
		    	if (err) {
		    		console.log(err);
		    	} else {
		    		fs.write(dataFile, data, null, "binary", function() {
		    			fs.close(dataFile);
		    		});
		    	}
		    });
		    
		  });
		
		
	} else {
		status = 404;
		content = "Страница " + request.url + " не найдена.";
	}
	
	//content = "<meta http-equiv=Content-Type content='text/html;charset=UTF-8'>" + content;
	
  response.writeHead(status, {"Content-Type": "text/html;charset=UTF-8"});
  response.write(content);
  response.end();
};


var server = http.createServer(requestHandler);

server.listen(48429, "0.0.0.0"); // на cloud9 работает порт 8080

console.log("Server has started on 0.0.0.0:48429.");