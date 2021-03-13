// Batch users for query
export const batchUsers = async (keys: any, models: any) => {
  // Get all users which match
  const users = await models.User.findAll({
    where: {
      id: {
        $in: keys,
      },
    },
  });

  return keys.map((key: any) => users.find((user: any) => user.id === key));
};
