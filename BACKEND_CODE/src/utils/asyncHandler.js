const asyncHandler = (requestHandler) => {
  return (req, res, next) => {
    Promise.resolve(requestHandler(req, res, next)).catch((err) => {
      // console.log(err);
      // return next(err);
      if (!err.statusCode) {
        return res.status(500).send({
          error: 'SomeThing Is Wrong',
          success: false,
        });
      }
      return res.status(err.statusCode).send({
        error: err.message,
        success: err.success,
      });
    });
  };
};

export { asyncHandler };

// const asyncHandler = () => {}
// const asyncHandler = (func) => () => {}
// const asyncHandler = (func) => async () => {}

// const asyncHandler = (fn) => async (req, res, next) => {
//     try {
//         await fn(req, res, next)
//     } catch (error) {
//         res.status(err.code || 500).json({
//             success: false,
//             message: err.message
//         })
//     }
// }
