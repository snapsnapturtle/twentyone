import { Button } from 'baseui/button';
import { ALIGN, HeaderNavigation, StyledNavigationItem as NavigationItem, StyledNavigationList as NavigationList } from 'baseui/header-navigation';
import { StyledLink } from 'baseui/link';
import React from 'react';
import { Link } from 'react-router-dom';

export function Navigation() {
    return (
        <HeaderNavigation>
            <NavigationList $align={ALIGN.left}>
                <NavigationItem>
                    <Link to="/">
                        <StyledLink>
                            Twentyone
                        </StyledLink>
                    </Link>
                </NavigationItem>
            </NavigationList>
            <NavigationList $align={ALIGN.center} />
            <NavigationList $align={ALIGN.right}>
                <NavigationItem>
                    <Link to="/profile">
                        <StyledLink href='/profile'>
                            Profile
                        </StyledLink>
                    </Link>
                </NavigationItem>
                <NavigationItem>
                    <Link to="/join-session">
                        <StyledLink>
                            Join Session
                        </StyledLink>
                    </Link>
                </NavigationItem>
                <NavigationItem>
                    <Button kind="secondary" disabled>New Game</Button>
                </NavigationItem>
            </NavigationList>
            <NavigationList $align={ALIGN.right}/>
        </HeaderNavigation>
    );
}
