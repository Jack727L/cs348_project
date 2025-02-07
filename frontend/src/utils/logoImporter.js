export const getTeamLogo = (teamId) => {
    try {
      return require(`../assets/logos/${teamId}.svg`).default;
    } catch (err) {
      console.error(`Logo for team ID ${teamId} not found.`);
      return require(`../assets/logos/default.svg`).default; // Fallback logo
    }
  };