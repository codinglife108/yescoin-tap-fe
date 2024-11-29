import React, { FC, ReactNode } from 'react';
import './IconText.css';
import Img from "../Img/Img";

const SIZES = {
    xl: {
        imgSize: 42,
        fontSize: 39,
        fontWeight: 700, // bold
        distance: 16,
    },
    large: {
        imgSize: 36,
        fontSize: 42,
        fontWeight: 700, // bold
        distance: 16,
    },
    medium: {
        imgSize: 20,
        fontSize: 20,
        fontWeight: 500, // medium
        distance: 12,
    },
    small: {
        imgSize: 16,
        fontSize: 16,
        fontWeight: 400,
        distance: 4,
    },

    special: {
        imgSize: 24,
        fontSize: 18,
        fontWeight: 500,
        distance: 8,
    },

    specialTeam: {
        imgSize: 25,
        fontSize: 24,
        fontWeight: 500,
        distance: 8,
    },

    mediumLevels: {
        imgSize: 26,
        fontSize: 20,
        fontWeight: 400, // medium
        distance: 12,
    },
    mediumTasks: {
        imgSize: 20,
        fontSize: 18,
        fontWeight: 500, // medium
        distance: 6,
    }
};

interface IconTextProps {
    size: 'large' | 'medium' | 'small' | 'special' | 'specialTeam' | 'mediumLevels' | 'xl' | 'mediumTasks'
    imgPath: string
    text: string | ReactNode
    textColor?: string
    after?: ReactNode
    stretched?: boolean
    style?: React.CSSProperties
    centered?: boolean
    containerStyle?: React.CSSProperties
    onClick?: React.MouseEventHandler<HTMLDivElement>
}

const IconText: FC<IconTextProps> = ({ containerStyle, size, imgPath, style, centered, text, after, onClick, textColor = 'var(--white_color)', stretched = false }) => {
    const centeredStyle = centered ? { marginBottom: 3 } : {};
    return (
        <div style={{ width: stretched ? '100%' : 'max-content', ...(style || {}) }}>
            <div
                className="IconText--content"
                onClick={onClick}
                style={{ cursor: onClick ? 'pointer' : 'auto', ...centeredStyle, ...containerStyle }}
            >
                <Img
                    src={imgPath}
                    width={SIZES[size].imgSize}
                    height={SIZES[size].imgSize}
                />

                <p
                    style={{
                        color: textColor,
                        fontSize: SIZES[size].fontSize,
                        fontWeight: SIZES[size].fontWeight,
                        marginLeft: SIZES[size].distance,
                        ...centeredStyle,
                    }}
                >
                    {text}
                </p>

                {after && (
                    <div style={{ marginLeft: SIZES[size].distance }}>
                        {after}
                    </div>
                )}
            </div>
        </div>
    );
};

export default IconText;