import React, {FC, useState, useEffect} from 'react';
import Img from '../Img/Img';

import userAvatar0 from '../../assets/images/usersAvatars/0.jpg';
import userAvatar1 from '../../assets/images/usersAvatars/1.jpg';
import userAvatar2 from '../../assets/images/usersAvatars/2.jpg';
import userAvatar3 from '../../assets/images/usersAvatars/3.jpg';
import userAvatar4 from '../../assets/images/usersAvatars/4.jpg';
import userAvatar5 from '../../assets/images/usersAvatars/5.jpg';
import userAvatar6 from '../../assets/images/usersAvatars/6.jpg';
import userAvatar7 from '../../assets/images/usersAvatars/7.jpg';
import userAvatar8 from '../../assets/images/usersAvatars/8.jpg';
import userAvatar9 from '../../assets/images/usersAvatars/9.jpg';
import userAvatar10 from '../../assets/images/usersAvatars/10.jpg';
import userAvatar11 from '../../assets/images/usersAvatars/11.jpg';
import userAvatar12 from '../../assets/images/usersAvatars/12.jpg';
import userAvatar13 from '../../assets/images/usersAvatars/13.jpg';
import userAvatar14 from '../../assets/images/usersAvatars/14.jpg';
import userAvatar15 from '../../assets/images/usersAvatars/15.jpg';
import userAvatar16 from '../../assets/images/usersAvatars/16.jpg';
import userAvatar17 from '../../assets/images/usersAvatars/17.jpg';
import userAvatar18 from '../../assets/images/usersAvatars/18.jpg';
import userAvatar19 from '../../assets/images/usersAvatars/19.jpg';

const userAvatars = [
    userAvatar0,
    userAvatar1,
    userAvatar2,
    userAvatar3,
    userAvatar4,
    userAvatar5,
    userAvatar6,
    userAvatar7,
    userAvatar8,
    userAvatar9,
    userAvatar10,
    userAvatar11,
    userAvatar12,
    userAvatar13,
    userAvatar14,
    userAvatar15,
    userAvatar16,
    userAvatar17,
    userAvatar18,
    userAvatar19,
]

interface UserImagePlaceholderProps {
    userTgId: string;
}

const UserImagePlaceholder: FC<UserImagePlaceholderProps> = ({ userTgId }) => {
    
    const getTelegramImageUrlPlaceholder = (username: string) => {
        function hashString(str: string) {
            let hash = 0;
            for (let i = 0; i < str.length; i++) {
                hash = (hash << 5) - hash + str.charCodeAt(i);
                hash |= 0; // Convert to 32bit integer
            }
            return hash;
        }
      
        // Hash the input string
        const hash = hashString(username);
      
        // Map the hash to one of 20 possibilities
        const possibility = Math.abs(hash) % 20;
      
        return userAvatars[possibility]
    };



    return (
        <Img src={getTelegramImageUrlPlaceholder(userTgId)} />
    );
};

export default UserImagePlaceholder;