export const revalidate = 1_000_000;

export default async function Info() {
  return (
    <>
      <h1
        className="mt-5 mb-4 text-center text-3xl font-bold tracking-tight leading-none text-gray-900 md:text-5xl lg:text-6xl dark:text-white"
      >
        Woel
      </h1>
      <p
        className="mb-4 text-center text-xl font-semibold text-gray-500 lg:text-xl sm:px-16 lg:px-48 dark:text-gray-400"
      >
        Cerchi dei libri scolastici usati?<br />
        Vuoi vendere dei libri che non ti servono più?
      </p>
      <p
        className="mb-4 text-center text-lg font-normal text-gray-500 lg:text-xl sm:px-16 lg:px-48 dark:text-gray-400"
      >
        Woel fa al caso tuo.<br />
        Si tratta di una piattaforma peer-to-peer per la compra-vendita di libri scolastici usati.
      </p>
      <p
        className="text-center text-lg font-normal text-gray-500 lg:text-xl sm:px-16 lg:px-48 dark:text-gray-400"
      >
        È appena finito l'anno e non vedete l'ora di sbarazzarvi dei vostri libri? Grazie a Woel potrete create degli annunci visibili a tutti gli studenti della vostra scuola!<br/>
        Vi servono dei libri ma volete risparmiare comprandoli usati? Woel vi permette di consultare centinaia di annunci filtrandoli in base a libro offerto, prezzo, condizioni e molto altro!
      </p>
    </>
  )
}
