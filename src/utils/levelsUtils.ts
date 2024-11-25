
const LEVELS:any = {
    "Fudders league": {
        name: 'Fudders',
        icon: '1',
    },
    "Jeets league": {
        name: 'Jeets',
        icon: '2',
    },
    "Degens league": {
        name: 'Degens',
        icon: '3',
    },
    "Hodlers league": {
        name: 'Holders',
        icon: '4',
    },
    "Diamond hands league": {
        name: 'Diamond',
        icon: '5',
    },
    /*diamond: {
        name: 'Diamond',
        icon: 'diamond',
    },
    master: {
        name: 'Master',
        icon: 'master',
    },
    grandmaster: {
        name: 'Grandmaster',
        icon: 'grandmaster',
    },
    elite: {
        name: 'Elite',
        icon: 'elite',
    },
    legendary: {
        name: 'Legendary',
        icon: 'legendary',
    },
    mythic: {
        name: 'Mythic',
        icon: 'mythic',
    },*/
};
export const convertLevelIdToLevel = (levelId: any) => {
    return LEVELS[levelId];
}