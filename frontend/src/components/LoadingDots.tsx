export default function LoadingDots( { color }: { color: string} ) {
  return (
    <div className="flex items-start justify-start p-4 space-x-2">
      <span className="sr-only">Cargando...</span>
      {/* Punto 1 */}
      <div className={`h-1.5 w-1.5 ${color} rounded-full animate-bounce [animation-delay:-0.3s]`}></div>
      {/* Punto 2 */}
      <div className={`h-1.5 w-1.5 ${color} rounded-full animate-bounce [animation-delay:-0.15s]`}></div>
      {/* Punto 3 */}
      <div className={`h-1.5 w-1.5 ${color} rounded-full animate-bounce`}></div>
      {/* Punto 4 */}
      <div className={`h-1.5 w-1.5 ${color} rounded-full animate-bounce [animation-delay:0.15s]`}></div>
    </div>
  );
}