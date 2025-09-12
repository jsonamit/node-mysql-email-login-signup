exports.verifyRequest = (req, options = []) => {
    let resp = {
      resp: 1,
      msg: ""
    };
  
    if (!req.body || Object.keys(req.body).length === 0) {
      return {
        resp: 0,
        msg: "Request body is missing"
      };
    }
  
    let missingKeys = [];
    for (let key of options) {
        if (!req.body.hasOwnProperty(key)) {
            missingKeys.push(key);
        }
    }
  
    if (missingKeys.length > 0) {
      return {
        resp: 0,
        msg: `${missingKeys.join(", ")} ${missingKeys.length > 1 ? "parameter are" : "parameter is"} missing!`
      };
    }
  
    return resp;
};

exports.encrypt = async (req, options) => {
    
}
  