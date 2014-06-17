var https = require('https'),
	app = {
		api: {
			hostname: 'pointhq.com',
			username: null,
			apitoken: null,
			timeout: 10000,
		}
	};

function validate(params, list, callback){
	for(key in list){
		if(!(list[key] in params)){
			callback('param not found: ' + list[key]);
			return false;
		}
	}
	return true;
}

app.zones = {
	list: function(params, callback){
		var query = '';
		if(typeof params !== 'undefined' && 'group' in params){
			query = '?group=' + params['group'];
		}
		app.req(200, 'GET', '/zones' + query, {'list_escape': 'zone'}, callback);
	}
}

app.zone = {
	add: function(fields, callback){
		app.req(201, 'POST', '/zones', {'escape': 'zone', 'fields': {'zone': fields}}, callback);
	},
	update: function(params, fields, callback){
		if(!(validate(params, ['zone_id'], callback))){
			return;
		}
		app.req(202, 'PUT', '/zones' + params['zone_id'], {'escape': 'zone', 'fields': {'zone': fields}}, callback);
	},
	get: function(params, callback){
		if(!(validate(params, ['zone_id'], callback))){
			return;
		}
		app.req(200, 'GET', '/zones/' + params['zone_id'], {'escape': 'zone'}, callback);
	},
	del: function(params, callback){
		if(!(validate(params, ['zone_id'], callback))){
			return;
		}
		app.req(202, 'DELETE', '/zones/' + params['zone_id'], {'escape': 'zone'}, callback);
	}
}

app.records = {
	list: function(params, callback){
		if (!(validate(params, ['zone_id'], callback))){
			return;
		}
	app.req(200, 'GET', '/zones/' + params['zone_id'] + '/records/', {'list_escape': 'zone_record'}, callback);
	}
}

app.record = {
	add: function(params, fields, callback){ // zone_record
		if (!(validate(params, ['zone_id'], callback))){
			return;
		}
		app.req(201, 'POST', '/zones/' + params['zone_id'] + '/records/', { 'escape': 'zone_record', 'fields':{'zone_record': fields}}, callback);
	},
	update: function(params, fields, callback){  // zone_record
		if (!(validate(params, ['zone_id', 'record_id'], callback))){
			return;
		}
		app.req(202, 'PUT', '/zones/' + params['zone_id'] + '/records/' + params['record_id'], { 'escape': 'zone_record', 'fields':{'zone_record': fields}}, callback);
	},
	get: function(params, callback){  // zone_record
		if (!(validate(params, ['zone_id', 'record_id'], callback))){
			return
		}
		app.req(200, 'GET', '/zones/' + params['zone_id'] + '/records/' + params['record_id'], {'escape': 'zone_record'}, callback);
	},
	del: function(params, callback){  //  zone_record
		if (!(validate(params, ['zone_id', 'record_id'], callback))){
			return;
		}
		app.req(202, 'DELETE', '/zones/' + params['zone_id'] + '/records/' + params['record_id'], {'escape': 'zone_record'}, callback);
	}
}
app.req = function(status, method, path, data, callback){
	// credentials
	if(!app.api.username || !app.api.apitoken){
		return callback('credentials missing');
	}

	var querystr = JSON.stringify(data['fields']),
		auth = 'Basic ' + new Buffer(app.api.username + ':' + app.api.apitoken).toString('base64'),
		headers = {
			'Accept': 'application/json',
			'User-Agent': 'Nodejs-pointDNS',
			'Authorization': auth,
		},
		options = {
			host: app.api.hostname,
			port: 443,
			path: path,
			method: method,
			headers: headers,
		}

	if(method.match(/(POST|PUT)/)){
		headers['Content-Type'] = 'application/json';
		headers['Content-Length'] = querystr.length;
	}

	//request
	var req = https.request(options, function(res){
		if(res.statusCode == 404){
			return callback('404 response. Incorrect or invalid fields');
		}
		if (res.statusCode != status){
			return callback('Invalid status code: '+res.statusCode);
		}
		var responseData = '';
		res.on('data', function(chunk){
			responseData += chunk;
		});
		res.on('end', function(){
			result = JSON.parse(responseData);
			if('escape' in data){
				result = result[data['escape']];
			}else if('list_escape' in data){
				tmp = [];
				result.forEach(function(entry){
					tmp.push(entry[data['list_escape']]);
				})
				result = tmp;
			}
			callback(null, result)
		});
	});

	// timeout
	req.on('socket', function(socket){
		if(app.api.timeout){
			socket.setTimeout(app.api.timeout)
			socket.on('timeout', function(){
				req.abort();
			})
		}
	})

	req.on('error', function(err){
		return callback(err);
	});

	if(method.match(/(POST|PUT)/)){
		req.end(querystr);
	}else{
		req.end();
	}
}
module.exports = function(setup){
	for(var k in setup){
		app.api[k] = setup[k];
	}
	return app;
}
