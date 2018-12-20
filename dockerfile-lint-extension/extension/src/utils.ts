import { app, CodeEditor, Window } from 'sourcegraph'

async function sleep(milliseconds: number): Promise<void> {
    return new Promise<void>(resolve => setTimeout(resolve, milliseconds))
}

export function activeWindow(): Promise<Window> {
    let retries = 5

    const getActiveWindow = async (): Promise<Window> => {
        if (retries-- === 0) {
            throw new Error('Could not activate: no active editor')
        }
        const window: Window | null  = app.activeWindow ? app.activeWindow : null
        if (window) {
            return window
        } else {
            await sleep(500)
            return await getActiveWindow()
        }
    }

    return getActiveWindow()
}

export async function activeEditor(): Promise<CodeEditor> {
    const window = await activeWindow()
    return window.visibleViewComponents[0]
}

/**
 * Creates a function that memoizes the async result of func.
 * If the promise rejects, the value will not be cached.
 *
 * @param resolver If resolver provided, it determines the cache key for storing the result based on
 * the first argument provided to the memoized function.
 */
export function memoizeAsync<P, T>(
    func: (params: P) => Promise<T>,
    resolver?: (params: P) => string
): (params: P, force?: boolean) => Promise<T> {
    const cache = new Map<string, Promise<T>>()
    return (params: P, force = false) => {
        const key = resolver ? resolver(params) : params.toString()
        const hit = cache.get(key)
        if (!force && hit) {
            return hit
        }
        const p = func(params).catch(e => {
            cache.delete(key)
            throw e
        })
        cache.set(key, p)
        return p
    }
}
