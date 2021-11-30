const fs = require('fs');
deleteImage = function(file) {
  const path_file = './uploads/' + file;

  fs.exists(path_file, (exists) => {
    if (exists) {
      fs.unlink(path_file, (err) => {
        if (err) return false;
      });
    }
  });
  return true;
}

module.exports = {
  deleteImage
};