


const CarteCT = ({ ctValidite }: { ctValidite: string }) => (
    <div className="flex-1 rounded-xl bg-white shadow-sm p-4">
        <h2 className="text-lg font-semibold mb-2">Contrôle Technique</h2>
        <p>Validité : <strong>{ctValidite}</strong></p>
        <span className={`mt-2 inline-block px-3 py-1 rounded-full text-xs font-medium ${
            new Date(ctValidite) > new Date() ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
        }`}>
      {new Date(ctValidite) > new Date() ? "CT valide" : "CT expiré"}
    </span>
    </div>
);
export default CarteCT;