
class NotFoundError extends Error {
  constructor(message = 'Not Found', status = 404) {
    super(message);
    this.name = 'NotFoundError';
    this.status = status;
  }
}
export default NotFoundError