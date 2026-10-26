export default function ProgressBar({ value }: { value: number }) {
    const percent = Math.round(Math.min(100, Math.max(0, value)));

    return (
        <div className="stc-progress" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={percent}>
            <div className="stc-progress-fill" style={{ width: `${percent}%` }} />
        </div>
    );
}
