import { Button } from 'baseui/button';
import { Card, StyledAction, StyledBody } from 'baseui/card';
import { FormControl } from 'baseui/form-control';
import { Input } from 'baseui/input';
import { HeadingMedium, ParagraphMedium } from 'baseui/typography';
import React, { FormEvent, useState } from 'react';
import { Redirect, useHistory, useRouteMatch } from 'react-router-dom';
import { Navigation } from '../../../components/Navigation';
import { axiosInstance } from '../../../shared/axios';

export function JoinSessionPage() {
    const history = useHistory();
    const { params } = useRouteMatch<{ sessionKey?: string }>();
    const [ sessionKeyText, setSessionKeyText ] = useState<string>('');
    const [ loading, setLoading ] = useState(false);
    const [ error, setError ] = useState(false);

    if (params.sessionKey) {
        console.info('Automatic redirect for session' + params.sessionKey);
        return <Redirect to={`/session/${params.sessionKey}`} />;
    }

    const handleFormSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);

        axiosInstance.get(`/v1/sessions/${sessionKeyText}`).then((r) => {
            console.log('success', r.data)
            history.push(`/session/${sessionKeyText}`);
        }).catch(() => {
            setError(true);
        }).finally(() => {
            setLoading(false);
        });
    };

    return (
        <div>
            <Navigation />

            <Card overrides={{ Root: { style: { maxWidth: '30em', marginLeft: '50%', marginTop: '10%', transform: 'translateX(-50%)' } } }}>
                <form onSubmit={handleFormSubmit}>
                    <StyledBody>
                        <HeadingMedium>Join Session</HeadingMedium>
                        <ParagraphMedium>Enter the session id in the field below and click "Join" to get to the game.</ParagraphMedium>
                        <FormControl error={error ? 'Session does not exist' : null}>
                            <Input
                                placeholder="Session ID"
                                value={sessionKeyText}
                                error={error}
                                required
                                onChange={(e: any) => {
                                    setError(false);
                                    setSessionKeyText(e.target.value);
                                }}
                            />
                        </FormControl>
                    </StyledBody>
                    <StyledAction>
                        <Button
                            isLoading={loading}
                            overrides={{
                                BaseButton: { style: { width: '100%' } }
                            }}
                        >Join</Button>
                    </StyledAction>
                </form>
            </Card>
        </div>
    );
}
