import React, {FC} from 'react';
import {Skeleton} from "@nextui-org/react";

/* interface FriendsListSkeletonProps {

} */

const FriendsListSkeleton: FC = () => {
    return (
        <>
            <Skeleton
                style={{
                    width: '100%',
                    height: 48,
                    borderRadius: 16,
                    marginBottom: 16,
                }}
            />
            <Skeleton
                style={{
                    width: '100%',
                    height: 48,
                    borderRadius: 16,
                    marginBottom: 16,
                }}
            />
            <Skeleton
                style={{
                    width: '100%',
                    height: 48,
                    borderRadius: 16,
                }}
            />
        </>
    );
};

export default FriendsListSkeleton;