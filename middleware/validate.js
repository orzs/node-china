function parseField(field){
  return field.split(/\[|\]/).filter(function(s){ return s })
}

function getField(req,field){
  var val = req.body[field] 
  return val
}

exports.required = function(field){
  field = parseField(field)
  return function(req,res,next){
    if(getField(req,field)){
      next()
    }else{
      res.error(field.join(' ').replace('_',' ') + ' is required')
      res.redirect('back')
    }
  }
}

exports.lengthAbove = function(field,len){
  field = parseField(field)
  return function(req,res,next){
    if(getField(req,field).length > len){
      next()
    }else{
      res.error(field.join(' ').replace('_',' ') + ' must have more than ' + len + ' characters' )
      res.redirect('back')
    }
  }
}

exports.passConfirm = function(){
  return function(req,res,next){
    var data = req.body
    if (data.pass == data.confirm_pass){
      next()
    }else{
      res.error("The two passwords don't match")
      res.redirect('back')
    } 
  }
}

exports.emailConfirm = function(){
  return function(req,res,next){
    var email = req.body.email
    if(email.indexOf('@') != -1){
      next()
    }else{
      res.error("email isn't format")
      res.redirect('back')
    }
  }
}
