interface Props {
    step: number;
  }
  
  export default function StepHeader({
    step,
  }: Props) {
    const percentage =
      (step / 8) * 100;
  
    return (
      <div className="mb-10 text-slate-400">
        <div className="flex justify-between mb-2">
          <span>
            Step {step} of 8
          </span>
  
          <span>
            {Math.round(percentage)}%
          </span>
        </div>
  
        <div className="h-2 bg-slate-800 rounded-full">
          <div
            className="h-full bg-violet-400 rounded-full"
            style={{
              width: `${percentage}%`,
            }}
          />
        </div>
      </div>
    );
  }