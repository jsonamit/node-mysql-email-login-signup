exports.sendResponse = (res,data) => {
    let resp = {
        resp: 0,
        msg: ''
    }
    if(!data.hasOwnProperty('msg')){
        resp['msg'] = 'Something went wrong !!';
    }
    if(data.hasOwnProperty('msg')){
        resp['msg'] = data['msg'];
    }
    if(data.hasOwnProperty('resp')){
        resp['resp'] = data['resp'];
    }
    if(data.hasOwnProperty('data')){
        resp['data'] = data['data'];
    }
    return res.json(resp);
  };
  