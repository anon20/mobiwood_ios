import {Platform} from 'react-native';

export const FONT_FAMILY_LIGHT = Platform.OS==="android"?'Nunito-Light':'Cochin';
export const FONT_FAMILY_REGULAR = Platform.OS==="android"?'Nunito-Regular':'Cochin';
export const FONT_FAMILY_SEMIBOLD = Platform.OS==="android"?'Nunito-SemiBold':'Cochin';
export const FONT_FAMILY_BOLD = Platform.OS==="android"?'Nunito-Bold':'Cochin';

export const FONT_WEIGHT_LIGHT = '300';
export const FONT_WEIGHT_REGULAR = '400';
export const FONT_WEIGHT_SEMIBOLD = '600';
export const FONT_WEIGHT_BOLD = '700';

export const FONT_LIGHT = {
  fontFamily: FONT_FAMILY_LIGHT,
  fontWeight: FONT_WEIGHT_LIGHT,
};

export const FONT_REGULAR = {
  fontFamily: FONT_FAMILY_REGULAR,
  fontWeight: FONT_WEIGHT_REGULAR,
};

export const FONT_SEMIBOLD = {
  fontFamily: FONT_FAMILY_SEMIBOLD,
  fontWeight: FONT_WEIGHT_SEMIBOLD,
};

export const FONT_BOLD = {
  fontFamily: FONT_FAMILY_BOLD,
  fontWeight: FONT_WEIGHT_BOLD,
};
