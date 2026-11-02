# GW Fast Build

![GW Fast Build](icon.png)

Client mod for **Planetary Annihilation: Titans**. In Galactic War, your commander, fabbers, and factories build and produce at 100× speed. Metal and energy **costs stay the same**. A build still stalls if you cannot pay for it.

The AI does not get this. Skirmish is unchanged. The script only loads on the Galactic War play scene.

## What changes

- Build arms (commander, fabbers, factory arms, unit cannon, orbital launcher, support platform) spend metal and energy 100× faster, so a paid structure finishes in about 1% of the normal time.
- Factory cooldown is removed, so factories queue the next unit immediately.
- Mods are written onto **your** Galactic War inventory only, after cards are applied.

## Install

1. Download or clone this repository.
2. Copy the `com.pa.local.gw_fast_build` folder into your Titans client mods folder. The folder name must stay `com.pa.local.gw_fast_build`.

   Windows:

   ```
   %LOCALAPPDATA%\Uber Entertainment\Planetary Annihilation\client_mods\com.pa.local.gw_fast_build
   ```

3. Start Titans. Enable **GW Fast Build** in the mods list if it is not already on.
4. Start or continue a Galactic War. The browser console should log `GW Fast Build active. Construction rate x100`.

## Change the speed

Open `ui/mods/com.pa.local.gw_fast_build/gw_play.js` and edit the number at the top:

```js
var BUILD_SPEED = 100;
```

`100` is 100× construction demand (about 1% of normal build time once you can pay). `1` is vanilla speed. Factory cooldown stays at 0 no matter what this number is. Restart the war (or reload the Galactic War play scene) after you save.

## Notes

- This is a local client mod. It does not change the server simulation for other players. Use it in single-player Galactic War.
- If another mod already installed the same fast-build hook (`__gwFastBuildInstalled`), this copy does nothing. Running both is harmless; only one applies.
- Built against game build `116982`.
