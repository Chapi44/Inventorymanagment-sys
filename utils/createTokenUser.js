const createTokenUser = (user) => {
  return {
    fullname: user.fullname,
    userId: user._id,
    role: user.role,

  };
};

module.exports = createTokenUser;
