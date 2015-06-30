var mergeClasses = function(classes_object, class_string){
    var classes = class_string.split(' ');
    for( let i = 0; i < classes.length; i++ ){
        classes_object[classes[i]] = true;
    }
};

module.exports = mergeClasses;