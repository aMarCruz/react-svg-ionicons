/**
 * react-svg-ionicons v0.2.2 with svg files from Ionicons v4.5.5
 *
 * 317 dual-mode icons, 62 logo icons.
 *
 * @auhtor aMarCruz <amarcruzbox-git@yahoo.com>
 * @date 2019-02-02T13:58:03Z
 * @license MIT
 */
import * as React from 'react';

type Dict<T = any> = { [k: string]: T };

// tslint:disable-next-line:ban-types
export type Nullable<T> = { [K in keyof T]: (Object extends T[K] ? Nullable<T[K]> : T[K]) | null };
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

/**
 * SVG icon renderizer.
 */
export interface SVGIcon {
  (opts: object, iconTitle: string, ios?: boolean): JSX.Element;
}

/**
 * IonIcon class properties and attributes.
 */
export interface IonIconProps<T extends string> extends
    Omit<React.SVGAttributes<SVGSVGElement>, 'xmlns' | 'viewBox' | 'children'> {
  /**
   * The name with which the icon was registered.
   */
  name: T;
  /**
   * Color for `fill` and `stroke`, in any format accepted by CSS.
   */
  color?: string;
  /**
   * Value for `width` and `height`, any format accepted by CSS.
   */
  size?: string | number;
  /**
   * Icon style, overrides automatic detection of the platform.
   */
  mode?: 'ios' | 'md';
  /**
   * Overrides the default icon title (icon name in Title Case).
   */
  title?: string;
  /**
   * React `ref` to the `<svg>` element.
   */
  innerRef?: React.Ref<SVGSVGElement>;
}

/**
 * Bundle with name to icon translations
 */
export type IconMap = { [K in IconNames]?: SVGIcon };

/**
 * Allows to accept custom names in addIcons.
 */
export type CustomIconMap = Dict<SVGIcon | null | undefined>;

/**
 * Possible defaults
 */
export interface IonIconDefs extends Omit<IonIconProps<''>, 'name' | 'title' | 'innerRef'> {
}

/**
 * Size aliases
 */
export type IonIconSizes = Dict<string | number | undefined>;

/**
 * Main component to render a SVG ionicon.
 */
interface IonIcon<T extends string = IconNames> {}
export declare class IonIcon<T> extends React.PureComponent<IonIconProps<T>> {}

/**
 * Merge the given icons with the existent ones.
 *
 * To remove existing icons, set its value to `null` of `undefined`.
 *
 * @param iconMap Object with name-icon translations.
 */
export function addIcons(iconMap: Nullable<IconMap> & CustomIconMap): void;

/**
 * Merge the given values with the current defaults.
 *
 * Values with `null` or `undefined` will remove the existing property.
 *
 * @param defaults Properties to merge.
 */
export function setDefaults(defaults: Nullable<IonIconDefs>): void;

/**
 * Reset the table of named sizes.
 *
 * You can use custom names here, to remove the prdefined names, 'small'
 * and 'large', set them to `null` or `undefined`.
 *
 * @param sizes Object with a sizes map.
 */
export function setSizes(sizes: Nullable<IonIconSizes>): void;

/**
 * Add icon titles to the icon-name -> title transtations.
 *
 * @param sizes Object with a {icon-name: title} props.
 */
export function setTitles(iconTitles: Dict<string | null>): void;

/**
 * Class or space separated classes to add to the `className` property
 * of all the icons, in addition to the default or specific one.
 *
 * @param class Class or space separated list of classes.
 */
export function setBaseClass(classes: string): void;

/**
 * Icon names
 */
export type IconNames =
  | 'add'
  | 'add-circle'
  | 'add-circle-outline'
  | 'airplane'
  | 'alarm'
  | 'albums'
  | 'alert'
  | 'american-football'
  | 'analytics'
  | 'aperture'
  | 'apps'
  | 'appstore'
  | 'archive'
  | 'arrow-back'
  | 'arrow-down'
  | 'arrow-dropdown'
  | 'arrow-dropdown-circle'
  | 'arrow-dropleft'
  | 'arrow-dropleft-circle'
  | 'arrow-dropright'
  | 'arrow-dropright-circle'
  | 'arrow-dropup'
  | 'arrow-dropup-circle'
  | 'arrow-forward'
  | 'arrow-round-back'
  | 'arrow-round-down'
  | 'arrow-round-forward'
  | 'arrow-round-up'
  | 'arrow-up'
  | 'at'
  | 'attach'
  | 'backspace'
  | 'barcode'
  | 'baseball'
  | 'basket'
  | 'basketball'
  | 'battery-charging'
  | 'battery-dead'
  | 'battery-full'
  | 'beaker'
  | 'bed'
  | 'beer'
  | 'bicycle'
  | 'bluetooth'
  | 'boat'
  | 'body'
  | 'bonfire'
  | 'book'
  | 'bookmark'
  | 'bookmarks'
  | 'bowtie'
  | 'briefcase'
  | 'browsers'
  | 'brush'
  | 'bug'
  | 'build'
  | 'bulb'
  | 'bus'
  | 'business'
  | 'cafe'
  | 'calculator'
  | 'calendar'
  | 'call'
  | 'camera'
  | 'car'
  | 'card'
  | 'cart'
  | 'cash'
  | 'cellular'
  | 'chatboxes'
  | 'chatbubbles'
  | 'checkbox'
  | 'checkbox-outline'
  | 'checkmark'
  | 'checkmark-circle'
  | 'checkmark-circle-outline'
  | 'clipboard'
  | 'clock'
  | 'close'
  | 'close-circle'
  | 'close-circle-outline'
  | 'cloud'
  | 'cloud-circle'
  | 'cloud-done'
  | 'cloud-download'
  | 'cloud-outline'
  | 'cloud-upload'
  | 'cloudy'
  | 'cloudy-night'
  | 'code'
  | 'code-download'
  | 'code-working'
  | 'cog'
  | 'color-fill'
  | 'color-filter'
  | 'color-palette'
  | 'color-wand'
  | 'compass'
  | 'construct'
  | 'contact'
  | 'contacts'
  | 'contract'
  | 'contrast'
  | 'copy'
  | 'create'
  | 'crop'
  | 'cube'
  | 'cut'
  | 'desktop'
  | 'disc'
  | 'document'
  | 'done-all'
  | 'download'
  | 'easel'
  | 'egg'
  | 'exit'
  | 'expand'
  | 'eye'
  | 'eye-off'
  | 'fastforward'
  | 'female'
  | 'filing'
  | 'film'
  | 'finger-print'
  | 'fitness'
  | 'flag'
  | 'flame'
  | 'flash'
  | 'flash-off'
  | 'flashlight'
  | 'flask'
  | 'flower'
  | 'folder'
  | 'folder-open'
  | 'football'
  | 'funnel'
  | 'gift'
  | 'git-branch'
  | 'git-commit'
  | 'git-compare'
  | 'git-merge'
  | 'git-network'
  | 'git-pull-request'
  | 'glasses'
  | 'globe'
  | 'grid'
  | 'hammer'
  | 'hand'
  | 'happy'
  | 'headset'
  | 'heart'
  | 'heart-dislike'
  | 'heart-empty'
  | 'heart-half'
  | 'help'
  | 'help-buoy'
  | 'help-circle'
  | 'help-circle-outline'
  | 'home'
  | 'hourglass'
  | 'ice-cream'
  | 'image'
  | 'images'
  | 'infinite'
  | 'information'
  | 'information-circle'
  | 'information-circle-outline'
  | 'jet'
  | 'journal'
  | 'key'
  | 'keypad'
  | 'laptop'
  | 'leaf'
  | 'link'
  | 'list'
  | 'list-box'
  | 'locate'
  | 'lock'
  | 'log-in'
  | 'log-out'
  | 'logo-android'
  | 'logo-angular'
  | 'logo-apple'
  | 'logo-bitbucket'
  | 'logo-bitcoin'
  | 'logo-buffer'
  | 'logo-chrome'
  | 'logo-closed-captioning'
  | 'logo-codepen'
  | 'logo-css3'
  | 'logo-designernews'
  | 'logo-dribbble'
  | 'logo-dropbox'
  | 'logo-euro'
  | 'logo-facebook'
  | 'logo-flickr'
  | 'logo-foursquare'
  | 'logo-freebsd-devil'
  | 'logo-game-controller-a'
  | 'logo-game-controller-b'
  | 'logo-github'
  | 'logo-google'
  | 'logo-googleplus'
  | 'logo-hackernews'
  | 'logo-html5'
  | 'logo-instagram'
  | 'logo-ionic'
  | 'logo-ionitron'
  | 'logo-javascript'
  | 'logo-linkedin'
  | 'logo-markdown'
  | 'logo-model-s'
  | 'logo-no-smoking'
  | 'logo-nodejs'
  | 'logo-npm'
  | 'logo-octocat'
  | 'logo-pinterest'
  | 'logo-playstation'
  | 'logo-polymer'
  | 'logo-python'
  | 'logo-reddit'
  | 'logo-rss'
  | 'logo-sass'
  | 'logo-skype'
  | 'logo-slack'
  | 'logo-snapchat'
  | 'logo-steam'
  | 'logo-tumblr'
  | 'logo-tux'
  | 'logo-twitch'
  | 'logo-twitter'
  | 'logo-usd'
  | 'logo-vimeo'
  | 'logo-vk'
  | 'logo-whatsapp'
  | 'logo-windows'
  | 'logo-wordpress'
  | 'logo-xbox'
  | 'logo-xing'
  | 'logo-yahoo'
  | 'logo-yen'
  | 'logo-youtube'
  | 'magnet'
  | 'mail'
  | 'mail-open'
  | 'mail-unread'
  | 'male'
  | 'man'
  | 'map'
  | 'medal'
  | 'medical'
  | 'medkit'
  | 'megaphone'
  | 'menu'
  | 'mic'
  | 'mic-off'
  | 'microphone'
  | 'moon'
  | 'more'
  | 'move'
  | 'musical-note'
  | 'musical-notes'
  | 'navigate'
  | 'notifications'
  | 'notifications-off'
  | 'notifications-outline'
  | 'nuclear'
  | 'nutrition'
  | 'open'
  | 'options'
  | 'outlet'
  | 'paper'
  | 'paper-plane'
  | 'partly-sunny'
  | 'pause'
  | 'paw'
  | 'people'
  | 'person'
  | 'person-add'
  | 'phone-landscape'
  | 'phone-portrait'
  | 'photos'
  | 'pie'
  | 'pin'
  | 'pint'
  | 'pizza'
  | 'planet'
  | 'play'
  | 'play-circle'
  | 'podium'
  | 'power'
  | 'pricetag'
  | 'pricetags'
  | 'print'
  | 'pulse'
  | 'qr-scanner'
  | 'quote'
  | 'radio'
  | 'radio-button-off'
  | 'radio-button-on'
  | 'rainy'
  | 'recording'
  | 'redo'
  | 'refresh'
  | 'refresh-circle'
  | 'remove'
  | 'remove-circle'
  | 'remove-circle-outline'
  | 'reorder'
  | 'repeat'
  | 'resize'
  | 'restaurant'
  | 'return-left'
  | 'return-right'
  | 'reverse-camera'
  | 'rewind'
  | 'ribbon'
  | 'rocket'
  | 'rose'
  | 'sad'
  | 'save'
  | 'school'
  | 'search'
  | 'send'
  | 'settings'
  | 'share'
  | 'share-alt'
  | 'shirt'
  | 'shuffle'
  | 'skip-backward'
  | 'skip-forward'
  | 'snow'
  | 'speedometer'
  | 'square'
  | 'square-outline'
  | 'star'
  | 'star-half'
  | 'star-outline'
  | 'stats'
  | 'stopwatch'
  | 'subway'
  | 'sunny'
  | 'swap'
  | 'switch'
  | 'sync'
  | 'tablet-landscape'
  | 'tablet-portrait'
  | 'tennisball'
  | 'text'
  | 'thermometer'
  | 'thumbs-down'
  | 'thumbs-up'
  | 'thunderstorm'
  | 'time'
  | 'timer'
  | 'today'
  | 'train'
  | 'transgender'
  | 'trash'
  | 'trending-down'
  | 'trending-up'
  | 'trophy'
  | 'tv'
  | 'umbrella'
  | 'undo'
  | 'unlock'
  | 'videocam'
  | 'volume-high'
  | 'volume-low'
  | 'volume-mute'
  | 'volume-off'
  | 'walk'
  | 'wallet'
  | 'warning'
  | 'watch'
  | 'water'
  | 'wifi'
  | 'wine'
  | 'woman'
;
