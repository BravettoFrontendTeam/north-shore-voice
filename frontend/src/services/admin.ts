export async function getEmpathyConfig(facilityId = 'default') {
  const res = await fetch(`/api/admin/empathy-config?facilityId=${encodeURIComponent(facilityId)}`)
  return res.json()
}

export async function saveEmpathyConfig(facilityId = 'default', config: any) {
  const res = await fetch(`/api/admin/empathy-config`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ facilityId, config }),
  })
  return res.json()
}

export async function testAbeKeys(facilityId = 'default') {
  const res = await fetch(`/api/admin/abekeys/test`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ facilityId }),
  })
  return res.json()
}
