export default function Loader({ message = "Loading..." }) {
  return (
    <div className="min-h-screenflex items-center justify-center">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 border-4rounded-full animate-spin mx-auto"></div>
        <p className="text-slate-300 text-lg">{message}</p>
      </div>
    </div>
  );
}
