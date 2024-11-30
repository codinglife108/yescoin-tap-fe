import React, { FC } from 'react';

interface IconthreeStars {
    color?: string
}

const IconthreeStars: FC<IconthreeStars> = ({ color = "#8894a2" }: IconthreeStars) => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
            <g clip-path="url(#clip0_2091_144)">
                <path d="M16.2175 1.20305C16.0835 1.16726 15.9879 1.04927 15.9805 0.910963L15.9655 0.622782C15.9576 0.484786 15.8618 0.367419 15.728 0.331943C15.5944 0.296468 15.4529 0.35101 15.3776 0.46697L15.221 0.708267C15.1454 0.824853 15.0032 0.879395 14.8691 0.842981L14.5915 0.768435C14.457 0.731709 14.3141 0.786251 14.2385 0.903306C14.1627 1.02036 14.1713 1.17289 14.2599 1.28057L14.4407 1.50467C14.5084 1.58891 14.5285 1.70174 14.4941 1.80426L16.3359 1.23509L16.2175 1.20305Z" fill="#FFE165" />
                <path d="M16.4952 1.27714L16.3352 1.23416L14.4942 1.80068C14.487 1.8274 14.4762 1.85303 14.4623 1.87694L14.3057 2.11793C14.2299 2.23436 14.2379 2.38642 14.3254 2.49441C14.4131 2.60224 14.5603 2.64131 14.6899 2.59099L14.9581 2.48784C15.0873 2.43784 15.234 2.47659 15.3216 2.58396L15.5025 2.80791C15.5897 2.91574 15.7363 2.95512 15.8659 2.90543C15.9953 2.85573 16.0781 2.72836 16.0709 2.5899L16.0559 2.30187C16.0486 2.16341 16.1313 2.03604 16.2607 1.98634L16.529 1.88319C16.6568 1.8324 16.7381 1.7055 16.7304 1.56813C16.7228 1.43061 16.6281 1.3134 16.4952 1.27714Z" fill="#FFD839" />
                <path d="M5.84316 1.60954C5.93178 1.50201 5.94053 1.34933 5.86473 1.23227C5.78894 1.11522 5.64609 1.06068 5.51154 1.09756L4.14361 1.46529C4.10173 1.4756 4.05813 1.47717 4.01562 1.46966L2.19245 4.88377L2.17526 5.21899C2.16791 5.35746 2.25058 5.48498 2.38014 5.53468C2.50954 5.58438 2.65645 5.54515 2.74365 5.43716L3.63476 4.33648C3.72228 4.22927 3.86918 4.19051 3.99827 4.24052L5.32056 4.74781C5.45012 4.79813 5.59734 4.75906 5.68485 4.65123C5.77253 4.54339 5.7805 4.39118 5.70454 4.27475L4.93095 3.08576C4.85547 2.96949 4.86328 2.81774 4.95049 2.70991L5.84316 1.60954Z" fill="#FF9811" />
                <path d="M3.79207 1.3312L3.02083 0.143465C2.94487 0.0285989 2.80391 -0.0246928 2.67107 0.0109392C2.53808 0.0465711 2.44274 0.163157 2.43446 0.300527L2.35882 1.71518C2.35163 1.8538 2.25599 1.97195 2.12206 2.00774L0.754131 2.37359C0.620042 2.40938 0.524242 2.52753 0.517053 2.66599C0.509708 2.80461 0.592537 2.93214 0.722094 2.98168L2.04423 3.48897C2.17363 3.53866 2.25646 3.66619 2.24911 3.80465L2.19238 4.88377L4.0143 1.46966C3.92382 1.45763 3.84286 1.40715 3.79207 1.3312Z" fill="#FFAF46" />
                <path d="M11.8486 6.87682L9.48606 3.23939C9.33509 3.00669 9.05144 2.89776 8.78342 2.96949C8.5154 3.04138 8.32427 3.27752 8.30989 3.55461L8.08297 7.88608C8.06843 8.16285 7.8773 8.39899 7.60959 8.47073L3.42002 9.59329C3.15184 9.66487 2.96024 9.90101 2.94571 10.1781C2.93118 10.4552 3.09683 10.7102 3.35595 10.8095L7.40533 12.3637C7.66429 12.4631 7.82995 12.7178 7.81541 12.9949L7.61303 16.851L12.1275 7.10952C12.0137 7.06108 11.9167 6.98012 11.8486 6.87682Z" fill="#FFD839" />
                <path d="M17.4036 7.0453C17.5777 6.82978 17.5935 6.52676 17.4427 6.29437C17.2919 6.06198 17.0087 5.95289 16.741 6.02431L12.5508 7.14672C12.4095 7.18345 12.26 7.17032 12.1273 7.10953L7.6128 16.851L7.58733 17.3262C7.57264 17.6033 7.73814 17.8582 7.9971 17.9576C8.25621 18.0568 8.54971 17.9782 8.72412 17.7626L11.4536 14.3919C11.6281 14.1764 11.9216 14.0978 12.1804 14.197L16.23 15.7515C16.4888 15.8514 16.7826 15.7731 16.9573 15.5576C17.132 15.3421 17.1481 15.0386 16.9971 14.8057L14.6343 11.1677C14.4834 10.9351 14.4993 10.6316 14.6737 10.4161L17.4036 7.0453Z" fill="#FFCD00" />
            </g>
            <defs>
                <clipPath id="clip0_2091_144">
                    <rect width="18" height="18" fill="white" />
                </clipPath>
            </defs>
        </svg>
    );
};

export default IconthreeStars;