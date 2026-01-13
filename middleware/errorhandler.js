export default async function errorHandler(err,req,res,next) {
    console.log(err.message);
  if (err.status == 404) {
    res.status(404).json({
      success: false,
      message: err.message,
    });
  } else if (err.status == 400) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  } else if (err.status == 409) {
    res.status(409).json({
      success: false,
      message: err.message,
    });
  } else {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }  
}