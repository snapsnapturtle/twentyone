import { Button } from 'baseui/button';
import { Card, StyledAction, StyledBody } from 'baseui/card';
import { FormControl } from 'baseui/form-control';
import { Input } from 'baseui/input';
import { HeadingMedium, ParagraphMedium } from 'baseui/typography';
import React, { FormEvent, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Navigation } from '../../../components/Navigation';
import { axiosInstance } from '../../../shared/axios';

export function JoinCampaignPage() {
    const history = useHistory();
    const [ campaignIdText, setCampaignIdText ] = useState<string>('');
    const [ loading, setLoading ] = useState(false);
    const [ error, setError ] = useState(false);

    const handleFormSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);

        axiosInstance.get(`/v1/campaigns/${campaignIdText}`).then((r) => {
            history.push(`/campaign/${campaignIdText}`);
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
                        <HeadingMedium>Join Campaign</HeadingMedium>
                        <ParagraphMedium>Enter the campaign id in the field below and click "Join" to get to the game.</ParagraphMedium>
                        <FormControl error={error ? 'Campaign does not exist' : null}>
                            <Input
                                placeholder="Campaign ID"
                                value={campaignIdText}
                                error={error}
                                required
                                onChange={(e: any) => {
                                    setError(false);
                                    setCampaignIdText(e.target.value);
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
