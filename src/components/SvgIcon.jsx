export default function SvgIcon({
  name,
  className,
  prefix = 'icon',
}) {
  const symbolId = `#${prefix}-${name}`
  return (
    <svg aria-hidden='true' className={className}>
      <use href={symbolId} fill='currentColor' />
    </svg>
  )
}