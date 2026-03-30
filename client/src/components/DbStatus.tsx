import { useEffect, useState } from "react";
import { checkDbConnection } from "../api/index";

type Status = 'checking' | 'connected' | 'error';

export default function DbStatus() {
    const [status, setStatus] = useState<Status>('checking');
    useEffect(() => {
        checkDbConnection()
            .then((text) => {
                setStatus(text.includes('connected') ? 'connected' : 'error');
            })
            .catch(() => setStatus('error'))
    }, [])

    const label: Record<Status, string> = {
        checking: 'Checking DB...',
        connected: 'DB Connected',
        error: 'DB Unavailable',
    }

    return (
    <span className={`db-status db-status--${status}`}>
        {label[status]}
    </span>
    )
}
