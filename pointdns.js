var https = require('https')

var app = {}

app.api = {
	hostname: 'pointhq.com',
	username: null,
	apitoken: null,
}

function validate(callback, params, list){
  for (key in list) {
    if (!(list[key] in params)){
      callback(new Error('param not found: ' + list[key]))
      return false
    }
  }
  return true
}

app.zones = {
  list: function(callback, params) {
    var query = ''
    if (typeof params !== 'undefined' && 'group' in params) {
      query = '?group=' + params['group']
    }
    app.call(200, 'GET', '/zones' + query, callback, {'list_escape': 'zone'})
  },
}

app.zone = {
  add: function(callback, fields) {
    app.call(201, 'POST', '/zones', callback, {'escape': 'zone', 'fields': {'zone': fields}})
  },
  update: function(callback, params, fields) {
    if (!(validate(callback, params, ['zone_id']))) {
       return
    }
    app.call(202, 'PUT', '/zones' + params['zone_id'], callback, {'escape': 'zone', 'fields': {'zone': fields}})
  },
  get: function(callback, params) {
    if (!(validate(callback, params, ['zone_id']))) {
       return
    }
    app.call(200, 'GET', '/zones/' + params['zone_id'], callback, {'escape': 'zone'})
  },
  del: function(callback, params) {
    if (!(validate(callback, params, ['zone_id']))) {
       return
    }
    app.call(202, 'DELETE', '/zones/' + params['zone_id'], callback, {'escape': 'zone'})
  },
}

app.records = {
  list: function(callback, params) {
    if (!(validate(callback, params, ['zone_id']))) {
       return
    }
    app.call(200, 'GET', '/zones/' + params['zone_id'] + '/records/', callback, {'list_escape': 'zone_record'})
  },
}

app.record = {
  add: function(callback, params, fields) { // zone_record
    if (!(validate(callback, params, ['zone_id']))) {
       return
    }
    app.call(201, 'POST', '/zones/' + params['zone_id'] + '/records', callback, { 'escape': 'zone_record', 'fields':{'zone_record': fields} })
  },
  update: function(callback, params, fields) {  // zone_record
    if (!(validate(callback, params, ['zone_id', 'record_id']))) {
       return
    }
    app.call(202, 'PUT', '/zones/' + params['zone_id'] + '/records' + params['record_id'], callback, { 'escape': 'zone_record', 'fields':{'zone_record': fields} })
  },
  get: function(callback, params) {  // zone_record
    if (!(validate(callback, params, ['zone_id', 'record_id']))) {
       return
    }
    app.call(200, 'GET', '/zones/' + params['zone_id'] + '/records/' + params['record_id'], callback, {'escape': 'zone_record'})
  },
  del: function(callback, params) {  //  zone_record
    if (!(validate(callback, params, ['zone_id', 'record_id']))) {
       return
    }
    app.call(202, 'DELETE', '/zones/' + params['zone_id'] + '/records' + params['record_id'], callback, {'escape': 'zone_record'})
  },
}


app.call = function(status, method, path, callback, data) {

  // credentials
  if( ! (app.api.username && app.api.apitoken) ) {
    callback( new Error('credentials missing') )
    return
  }

  var querystr = JSON.stringify(data['fields'])
  var auth = 'Basic ' + new Buffer(app.api.username + ':' + app.api.apitoken).toString('base64');
  var headers = {
    'Accept': 'application/json',
    'User-Agent': 'Nodejs-pointDNS',
    'Authorization': auth,
  }

  if( method.match( /(POST|PUT)/ ) ) {
    headers['Content-Type'] = 'application/json'
    headers['Content-Length'] = querystr.length
    console.log(headers)
  }

  var options = {
    host: app.api.hostname,
    port: 443,
    path: path,
    method: method,
    headers: headers,
  }

  //request
  var req = https.request(options, function(res) {
    if (res.statusCode != status) {
      callback( new Error('http error') )
      return
    }

    res.on('data', function(d) {
      result = JSON.parse( d )
      if ('escape' in data) {
        result = result[data['escape']]
      } else if ('list_escape' in data) {
        tmp = []
        result.forEach(function(entry) {
          tmp.push(entry[data['list_escape']])
        })
        result = tmp
      }
      callback(null, result)
    });
  });

  if( method.match( /(POST|PUT|DELETE)/ ) ) {
    req.end( querystr )
  } else {
    req.end()
  }

  req.on('error', function(e) {
    console.error(e);
    callback(e)
    return
  });

}

module.exports = function( setup ) {
  for( var k in setup ) {
    app.api[ k ] = setup[ k ]
  }
  return app
}

