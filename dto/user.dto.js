const toUserDTO = (user) => {
  if (!user) {
    return null;
  }

  return {
    id: user._id.toString(),
    name: user.name,
    whatsapp: user.whatsapp,
    role: user.role,
    isActive: user.isActive,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
};

module.exports = {
  toUserDTO,
};
