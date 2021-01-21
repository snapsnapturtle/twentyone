import React from 'react';
import { Redirect } from 'react-router-dom';

export function DashboardPage() {
    return (
        <Redirect to="/join-session" />
    );
}
