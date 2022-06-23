export function setupPlugin({ config, global }) {
    global.eventsToTrack = new Set((config.events || '').split(',').filter((a) => !!a))
    global.timezone = config.timezone || 'UTC'
}

export async function processEvent(event, meta) {
    const {
        global: { eventsToTrack, timezone },
    } = meta
    if (eventsToTrack.size > 0 && !eventsToTrack.has(event.event)) {
        return event
    }
    const cacheKey = 'cache1' // easily bust the cache
    const timestamp = event.timestamp || event.properties?.timestamp || event.now || event.sent_at
    const dateObj = new Date(timestamp)
    const dateString = dateObj.toLocaleString('en-GB', { timeZone: timezone }).split(/[ ,]+/)[0]

    await setIfNotCached(meta, JSON.stringify([cacheKey, event.event, event.distinct_id, dateString]), () => {
        event.properties['first_for_user_today'] = true
    })

    await setIfNotCached(meta, JSON.stringify([cacheKey, event.event, dateString]), () => {
        event.properties['first_today'] = true
    })

    return event
}

async function setIfNotCached({ cache, storage }, key: string, callback: () => void): void {
    // first time we see this event in redis in the last 24h
    if ((await cache.incr(key)) === 1) {
        callback?.()
        await cache.expire(key, 86400)
    }
}
