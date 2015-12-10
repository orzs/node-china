module.exports = function(fn,flag,perpage){
  perpage = perpage || 10
  return function(req,res,next){
    var page = Math.max(1,parseInt(req.params['page'] || '1',10)) -1;
    var option = {};
    var url;

    if(flag == 'tab'){
      option = { deleted:false,tab:req.params['name'] };
      var tab_name = req.params['name'];
      url = "tab/" + tab_name; 
    }else if(flag == 'feature'){
      var feature = req.params['feature'];
      url = "list/" + feature;
      if(feature == 'good'){
        option = { deleted:false,is_good:true };
      }else if(feature == 'no_reply'){
        option = { deleted:false,reply_count:0 };
      }else if(feature == 'last'){
        option = { deleted:false };
      }
    }else if(flag == 'entries'){
      url = "entries"; 
    }else if(flag == 'search'){
      url = 'search/all'; 
    }else if(flag == 'notifications'){
      url = 'notifications'; 
    }

    if(flag == 'tab' || flag == 'feature' || flag == 'entries'){
      fn(option,function(err,total){
        if(err) return next(err);
        req.page = res.locals.page ={
          number: page,
          perpage: perpage,
          skip: page * perpage,
          total: total,
          count: Math.ceil(total/perpage),
          option: url 
        };
        next();
      });
    }else if(flag == 'search'){
      var searchText = req.query['searchKey']; 
      fn(searchText,function(err,total){
        if(err) return next(err);
        req.page = res.locals.page ={
          number: page,
          perpage: perpage,
          skip: page * perpage,
          total: total,
          count: Math.ceil(total/perpage),
          option: url,
          searchKey:searchText 
        };
        next();
      });
    }else if(flag == 'notifications'){
      fn(req.user._id,function(err,total){
        if(err) return next(err);
        req.page = res.locals.page ={
          number: page,
          perpage: perpage,
          skip: page * perpage,
          total: total,
          count: Math.ceil(total/perpage),
          option: url 
        };
        next();
      });
    }
  }
}
