export default function AssistanceArea({ focusedItem }: { focusedItem: string }) {
  return (
    <div className="pt-12">
      {{ "expenses": <Expenses />, "occupier-vs-investor": <OccupierVsInvestor /> }[focusedItem]}
      {focusedItem}
    </div>
  )
}

function OccupierVsInvestor() {
  return <p></p>
}

function Expenses() {
  return (
    <div>
      <h5>Your Expenses</h5>
      <p>This is intended to capture your living expenses excluding rent</p>
    </div>
  )
}
