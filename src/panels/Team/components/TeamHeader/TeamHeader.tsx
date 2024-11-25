import React, {FC, ReactNode} from 'react';
import './TeamHeader.css';
import Icon24ExternalLink from "../../../../assets/icons/Icon24ExternalLink";

// @ts-ignore
const tg = window['Telegram'].WebApp;

interface TeamHeaderProps {
    image: ReactNode
    name: string
    link?: string
}

// todo: link
const TeamHeader: FC<TeamHeaderProps> = ({image, name, link }) => {

    const openLink = () => {
        if (!link) {
            return;
        }

        // @ts-ignore
tg.openLink(link);
    }

    return (
        <div className="TeamHeader--container">
            <div className="TeamHeader--avatar">
                {image}
            </div>

            <div
                className="TeamHeader--title"
                onClick={openLink}
                style={{
                    cursor: link ? 'pointer' : 'default'
                }}
            >
                <h1>{name}</h1>

                {link && (
                    <Icon24ExternalLink />
                )}
            </div>
        </div>
    );
};

export default TeamHeader;