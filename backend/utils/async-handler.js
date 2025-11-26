/**
  A utility function to handle asynchronous route handlers in Express.js.
    It wraps the provided async function and catches any errors,
    passing them to the next middleware (usually an error handler).
     write this with 2,3 types of syntax
 */

// const asyncHandler = (fn) =>{
//     return async (req, res, next) => {
//         try{
//             await fn(req, res, next);
//         } catch (error) {
//            next(error);
//         }
// }
// };

const asyncHandler = (requestHandler) => {
    return (req, res, next) => {
        Promise
        .resolve(requestHandler(req, res, next))
        .catch((error) => next(error));
    };
};




export default asyncHandler;    