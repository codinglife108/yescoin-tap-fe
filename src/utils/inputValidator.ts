import React from 'react'

export const teamFormChange = (
    input: string,
    event: any,
    setter: React.Dispatch<React.SetStateAction<any>>
) => {
    const value = event.target.value

    switch (input) {
        case 'name': {
            const regex = /^[a-zA-Zа-яА-Я0-9\s\-_]+$/
            if (!regex.test(value) && value.length > 1) {
                return
            }

            if (value.length > 25) {
                return
            }

            setter(value)
            break
        }

        case 'link': {
            /*const regex = /^(?:https?:\/\/)?(?:\w+\.)?[a-zA-Z0-9-]+\.[a-zA-Z]{2,}(?:\/\S*)?$/;
            if (!regex.test(value) && value.length > 1) {
                return;
            }*/

            if (value.length > 150) {
                return
            }

            setter(value)
            break
        }
    }
}
