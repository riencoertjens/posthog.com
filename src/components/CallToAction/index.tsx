import cntl from 'cntl'
import Link from 'components/Link'
import usePostHog from '../../hooks/usePostHog'
import React from 'react'

const sizes = {
    xs: 'text-sm font-bold px-4 py-2 border-2 border-b-3',
    sm: 'text-sm font-bold px-5 py-2.5 border-2 border-b-3',
    md: 'text-[15px] font-bold px-5 py-2 border-2 border-b-3',
    lg: 'text-base font-bold px-5 py-2  border-2 border-b-4',
}

const primary = cntl`
    border-yellow
    text-primary
    dark:text-primary-dark
    hover:dark:text-primary-dark
`

const secondary = cntl`
    text-primary
    border-text-primary
    dark:border-white
    border-text-primary
    dark:border-white
    border-2
    text-primary
    dark:text-primary-dark
`

const outline = cntl`
    bg-white
    border-black/10
    hover:border-black/30
    border
    text-primary
    hover:text-primary
`

const buttonTypes = {
    primary,
    secondary,
    outline,
    custom: '',
}

export const button = (
    type: keyof typeof buttonTypes = 'primary',
    width = 'auto',
    className = '',
    size: keyof typeof sizes = 'lg'
) => cntl`
    text-center
    select-none
    rounded-sm
    inline-block
    cta
    relative
    active:top-[0.5px]
    active:scale-[.98]
    w-${width}
    ${buttonTypes[type] || ''}
    ${sizes[size]}
    ${className}
`

export type CTAPropsType = {
    type?: keyof typeof buttonTypes
    width?: string
    size?: keyof typeof sizes
    href?: string
    to?: string
    onClick?: () => void
    children?: JSX.Element | string
    className?: string
    external?: boolean
    externalNoIcon?: boolean
    state?: any
    event?: any
}

export interface TrackedCTAPropsType extends CTAPropsType {
    event: {
        name: string
        [key: string]: any
    }
}

export const TrackedCTA = ({ event: { name: eventName, ...event }, ...props }: TrackedCTAPropsType): JSX.Element => {
    const posthog = usePostHog()

    return (
        <CallToAction
            {...props}
            onClick={() => {
                posthog?.capture(eventName, event)
                props.onClick && props.onClick()
            }}
        />
    )
}

export const CallToAction = ({
    type = 'primary',
    width = 'auto',
    size = 'lg',
    href,
    to,
    onClick,
    children,
    className,
    external,
    externalNoIcon,
    state = {},
    event,
}: CTAPropsType): JSX.Element => {
    const url = to || href
    return (
        <Link
            state={state}
            external={external}
            externalNoIcon={externalNoIcon}
            className={button(type, width, className, size)}
            onClick={onClick}
            to={url}
            event={event}
        >
            {children}
        </Link>
    )
}
