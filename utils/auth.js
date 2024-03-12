function createUserSession(req, user, action) {
  req.session.email = user.email;
  req.session.save(action);
}

function destroyUserAuthSession(req) {
  req.session.uid = null;
}

module.exports = {
  createUserSession: createUserSession,
  destroyUserAuthSession: destroyUserAuthSession,
};
