/* ********************************************************************
 **********************************************************************
 * HTML Virtual Keyboard Interface Script - v1.43
 *   Copyright (c) 2010 - GreyWyvern
 *
 *  - Licenced for free distribution under the BSDL
 *          http://www.opensource.org/licenses/bsd-license.php
 *
 * Add a script-driven keyboard interface to text fields, password
 * fields and textareas.
 *
 * See http://www.greywyvern.com/code/javascript/keyboard for examples
 * and usage instructions.
 *
 * Version 1.43 - October 29, 2010
 *   - Added Dingbats and Misc. Symbols layouts
 *   - Keyboard closes if a non-active form element is clicked
 *   - Added dropdown indicator arrow beside layout name
 *
 *   See full changelog at:
 *     http://www.greywyvern.com/code/javascript/keyboard.changelog.txt
 * 
 ** Changes by Martin Podolak on top of version 1.43:
 ** 2019-04-29 Old Church Slavonic (+dead keys) and Glagolitic added, Russian extended, Bulgarian and Serbian updated
 * 
 * Keyboard Credits
**  - Old Church Slavonic, Glagolitic and Russian extended keyboard layouts by Martin Podolak (podolak.net)
 *   - Khmer keyboard layout by Sovann Heng (km-kh.com)
 *   - Dari keyboard layout by Saif Fazel
 *   - Kurdish keyboard layout by Ara Qadir
 *   - Assamese keyboard layout by Kanchan Gogoi
 *   - Bulgarian BDS keyboard layout by Milen Georgiev
 *   - Basic Japanese Hiragana/Katakana keyboard layout by Damjan
 *   - Ukrainian keyboard layout by Dmitry Nikitin
 *   - Macedonian keyboard layout by Damjan Dimitrioski
 *   - Pashto keyboard layout by Ahmad Wali Achakzai (qamosona.com)
 *   - Armenian Eastern and Western keyboard layouts by Hayastan Project (www.hayastan.co.uk)
 *   - Pinyin keyboard layout from a collaboration with Lou Winklemann
 *   - Kazakh keyboard layout by Alex Madyankin
 *   - Danish keyboard layout by Verner Kjærsgaard
 *   - Slovak keyboard layout by Daniel Lara (www.learningslovak.com)
 *   - Belarusian and Serbian Cyrillic keyboard layouts by Evgeniy Titov
 *   - Bulgarian Phonetic keyboard layout by Samuil Gospodinov
 *   - Swedish keyboard layout by Håkan Sandberg
 *   - Romanian keyboard layout by Aurel
 *   - Farsi (Persian) keyboard layout by Kaveh Bakhtiyari (www.bakhtiyari.com)
 *   - Burmese keyboard layout by Cetanapa
 *   - Bosnian/Croatian/Serbian Latin/Slovenian keyboard layout by Miran Zeljko
 *   - Hungarian keyboard layout by Antal Sall 'Hiromacu'
 *   - Arabic keyboard layout by Srinivas Reddy
 *   - Italian and Spanish (Spain) keyboard layouts by dictionarist.com
 *   - Lithuanian and Russian keyboard layouts by Ramunas
 *   - German keyboard layout by QuHno
 *   - French keyboard layout by Hidden Evil
 *   - Polish Programmers layout by moose
 *   - Turkish keyboard layouts by offcu
 *   - Dutch and US Int'l keyboard layouts by jerone
 *
 ** Fork from Version 1.43 - October 29, 2010: Bookmarklet by Martin Podolak - https://github.com/pod-o-mart/keyboardBookmarklets
 * 2019-05-05 - Version 1.3: Adpated code to bookmarklet. Old Church Slavonic, Glagolitic, Russian extended keyboard layouts
 * 2021-09-28 - Version 1.4: Added language cookie. Tries to remember chosen language when staying on the same domain
 */
/* Bookmarklet adjustment: Get language if cookie exists */
function getCookie(vki_bm) {
  let name = vki_bm + "=";
  let decodedCookie = decodeURIComponent(document.cookie);
  let ca = decodedCookie.split(';');
  for(let i = 0; i <ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}
var kblang2 = getCookie("vki_bm");
/* END Bookmarklet adjustment: Get language if cookie exists */

var VKI_attach, VKI_close;
(function VKI_buildKeyboardInputs() {
  var self = this;

  this.VKI_version = "1.43";
  this.VKI_showVersion = false;
  this.VKI_target = false;
  this.VKI_shift = this.VKI_shiftlock = false;
  this.VKI_altgr = this.VKI_altgrlock = false;
  this.VKI_dead = false;
  this.VKI_deadBox = true; // Show the dead keys checkbox
  this.VKI_deadkeysOn = false;  // Turn dead keys on by default
  this.VKI_numberPad = false;  // Allow user to open and close the number pad
  this.VKI_numberPadOn = false;  // Show number pad by default
//  this.VKI_kts = this.VKI_kt = "English";  // Default keyboard layout
/* Bookmarklet adjustment: Set language from cookie - if not exists, from bookmarklet - else default  */
  if (kblang2 && (kblang2 != '') && (kblang2 != undefined)) {
    //alert("vki_BM" + kblang2);
    this.VKI_kts = this.VKI_kt = kblang = kblang2;
  }
  else if (kblang && (kblang != '') && (kblang != undefined)) {
    this.VKI_kts = this.VKI_kt = kblang ;
  }
  else {
    this.VKI_kts = this.VKI_kt = kblang = "\u0420\u0443\u0441\u0441\u043a\u0438\u0439";
  }  // END Bookmarklet adjustment
  this.VKI_langAdapt = false;  // Use lang attribute of input to select keyboard
  this.VKI_size = 4;  // Default keyboard size (1-5)
  this.VKI_sizeAdj = true;  // Allow user to adjust keyboard size
  this.VKI_clearPasswords = false;  // Clear password fields on focus
  this.VKI_imageURI = "data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAANAgMAAADH6eY5AAAADFBMVEUAAADAwMD///+AgID8PoY4AAAAUElEQVR4Xk3KsQ2AIBCF4TcEbHCVe1hoZ3IsZhyBRqdgCNzAwrgEHncGfHnVnw/FhmudSI68jE6OBNujecOpmVu/q5/j5/nnh2OnKN6H0P0LmzYfoht62vIAAAAASUVORK5CYII=";  // If empty string, use imageless mode
  this.VKI_clickless = 0;  // 0 = disabled, > 0 = delay in ms
  this.VKI_keyCenter = 3;

  this.VKI_isIE = /*@cc_on!@*/false;
  this.VKI_isIE6 = /*@if(@_jscript_version == 5.6)!@end@*/false;
  this.VKI_isIElt8 = /*@if(@_jscript_version < 5.8)!@end@*/false;
  this.VKI_isWebKit = RegExp("KHTML").test(navigator.userAgent);
  this.VKI_isOpera = RegExp("Opera").test(navigator.userAgent);
  this.VKI_isMoz = (!this.VKI_isWebKit && navigator.product == "Gecko");

  /* ***** i18n text strings ************************************* */
  this.VKI_i18n = {
    '00': "Display Number Pad",
    '01': "Display virtual keyboard interface",
    '02': "Select keyboard layout",
    '03': "Dead keys",
    '04': "on",
    '05': "off",
    '06': "Close the keyboard",
    '07': "Clear",
    '08': "Clear this input",
    '09': "Version",
    '10': "Decrease keyboard size",
    '11': "Increase keyboard size"
  };


  /* ***** Create keyboards ************************************** */
  this.VKI_layout = {};

  // - Lay out each keyboard in rows of sub-arrays.  Each sub-array
  //   represents one key.
  //
  // - Each sub-array consists of four slots described as follows:
  //     example: ["a", "A", "\u00e1", "\u00c1"]
  //
  //          a) Normal character
  //          A) Character + Shift/Caps
  //     \u00e1) Character + Alt/AltGr/AltLk
  //     \u00c1) Character + Shift/Caps + Alt/AltGr/AltLk
  //
  //   You may include sub-arrays which are fewer than four slots.
  //   In these cases, the missing slots will be blanked when the
  //   corresponding modifier key (Shift or AltGr) is pressed.
  //
  // - If the second slot of a sub-array matches one of the following
  //   strings:
  //     "Tab", "Caps", "Shift", "Enter", "Bksp",
  //     "Alt" OR "AltGr", "AltLk"
  //   then the function of the key will be the following,
  //   respectively:
  //     - Insert a tab
  //     - Toggle Caps Lock (technically a Shift Lock)
  //     - Next entered character will be the shifted character
  //     - Insert a newline (textarea), or close the keyboard
  //     - Delete the previous character
  //     - Next entered character will be the alternate character
  //     - Toggle Alt/AltGr Lock
  //
  //   The first slot of this sub-array will be the text to display
  //   on the corresponding key.  This allows for easy localisation
  //   of key names.
  //
  // - Layout dead keys (diacritic + letter) should be added as
  //   property/value pairs of objects with hash keys equal to the
  //   diacritic.  See the "this.VKI_deadkey" object below the layout
  //   definitions.  In each property/value pair, the value is what
  //   the diacritic would change the property name to.
  //
  // - Note that any characters beyond the normal ASCII set should be
  //   entered in escaped Unicode format.  (eg \u00a3 = Pound symbol)
  //   You can find Unicode values for characters here:
  //     http://unicode.org/charts/
  //
  // - To remove a keyboard, just delete it, or comment it out of the
  //   source code. If you decide to remove the US International
  //   keyboard layout, make sure you change the default layout
  //   (this.VKI_kt) above so it references an existing layout.


  this.VKI_layout['\u0411\u0435\u043b\u0430\u0440\u0443\u0441\u043a\u0430\u044f'] = {
    'name': "Belarusian", 'keys': [
      [["\u0451", "\u0401"], ["1", "!"], ["2", '"'], ["3", "\u2116"], ["4", ";"], ["5", "%"], ["6", ":"], ["7", "?"], ["8", "*"], ["9", "("], ["0", ")"], ["-", "_"], ["=", "+"], ["Bksp", "Bksp"]],
      [["Tab", "Tab"], ["\u0439", "\u0419"], ["\u0446", "\u0426"], ["\u0443", "\u0423"], ["\u043a", "\u041a"], ["\u0435", "\u0415"], ["\u043d", "\u041d"], ["\u0433", "\u0413"], ["\u0448", "\u0428"], ["\u045e", "\u040e"], ["\u0437", "\u0417"], ["\u0445", "\u0425"], ["'", "'"], ["\\", "/"]],
      [["Caps", "Caps"], ["\u0444", "\u0424"], ["\u044b", "\u042b"], ["\u0432", "\u0412"], ["\u0430", "\u0410"], ["\u043f", "\u041f"], ["\u0440", "\u0420"], ["\u043e", "\u041e"], ["\u043b", "\u041b"], ["\u0434", "\u0414"], ["\u0436", "\u0416"], ["\u044d", "\u042d"], ["Enter", "Enter"]],
      [["Shift", "Shift"], ["/", "|"], ["\u044f", "\u042f"], ["\u0447", "\u0427"], ["\u0441", "\u0421"], ["\u043c", "\u041c"], ["\u0456", "\u0406"], ["\u0442", "\u0422"], ["\u044c", "\u042c"], ["\u0431", "\u0411"], ["\u044e", "\u042e"], [".", ","], ["Shift", "Shift"]],
      [[" ", " "]]
    ], 'lang': ["be"] };

  this.VKI_layout['\u0411\u044a\u043b\u0433\u0430\u0440\u0441\u043a\u0438 \u0424\u043e\u043d\u0435\u0442\u0438\u0447\u0435\u043d'] = {
    'name': "Bulgarian Phonetic", 'keys': [
      [["\u0447", "\u0427"], ["1", "!"], ["2", "@"], ["3", "#"], ["4", "$"], ["5", "%"], ["6", "^"], ["7", "&"], ["8", "*"], ["9", "("], ["0", ")"], ["-", "_"], ["=", "+"], ["Bksp", "Bksp"]],
      [["Tab", "Tab"], ["\u044F", "\u042F"], ["\u0432", "\u0412"], ["\u0435", "\u0415"], ["\u0440", "\u0420"], ["\u0442", "\u0422"], ["\u044A", "\u042A"], ["\u0443", "\u0423"], ["\u0438", "\u0418"], ["\u043E", "\u041E"], ["\u043F", "\u041F"], ["\u0448", "\u0428"], ["\u0449", "\u0429"], ["\u044E", "\u042E"]],
      [["Caps", "Caps"], ["\u0430", "\u0410"], ["\u0441", "\u0421"], ["\u0434", "\u0414"], ["\u0444", "\u0424"], ["\u0433", "\u0413"], ["\u0445", "\u0425"], ["\u0439", "\u0419"], ["\u043A", "\u041A"], ["\u043B", "\u041B"], [";", ":"], ["'", '"'], ["Enter", "Enter"]],
      [["Shift", "Shift"], ["\u0437", "\u0417"], ["\u044C", "\u042C"], ["\u0446", "\u0426"], ["\u0436", "\u0416"], ["\u0431", "\u0411"], ["\u043D", "\u041D"], ["\u043C", "\u041C"], [",", "<"], [".", ">"], ["/", "?"], ["Shift", "Shift"]],
      [[" ", " "]]
    ], 'lang': ["bg"] };

  this.VKI_layout['\u0411\u044a\u043b\u0433\u0430\u0440\u0441\u043a\u0438'] = {
    'name': "Bulgarian BDS", 'keys': [
      [["`", "~"], ["1", "!"], ["2", "?"], ["3", "+"], ["4", '"'], ["5", "%"], ["6", "="], ["7", ":"], ["8", "/"], ["9", "_"], ["0", "\u2116"], ["-", "\u0406"], ["=", "V"], ["Bksp", "Bksp"]],
      [["Tab", "Tab"], [",", "\u044b"], ["\u0443", "\u0423"], ["\u0435", "\u0415"], ["\u0438", "\u0418"], ["\u0448", "\u0428"], ["\u0449", "\u0429"], ["\u043a", "\u041a"], ["\u0441", "\u0421"], ["\u0434", "\u0414"], ["\u0437", "\u0417"], ["\u0446", "\u0426"], [";", "\u00a7"], ["(", ")"]],
      [["Caps", "Caps"], ["\u044c", "\u042c"], ["\u044f", "\u042f"], ["\u0430", "\u0410"], ["\u043e", "\u041e"], ["\u0436", "\u0416"], ["\u0433", "\u0413"], ["\u0442", "\u0422"], ["\u043d", "\u041d"], ["\u0432", "\u0412"], ["\u043c", "\u041c"], ["\u0447", "\u0427"], ["Enter", "Enter"]],
      [["Shift", "Shift"], ["\u044e", "\u042e"], ["\u0439", "\u0419"], ["\u044a", "\u042a"], ["\u044d", "\u042d"], ["\u0444", "\u0424"], ["\u0445", "\u0425"], ["\u043f", "\u041f"], ["\u0440", "\u0420"], ["\u043b", "\u041b"], ["\u0431", "\u0411"], ["Shift", "Shift"]],
      [[" ", " "]]
    ]};

  this.VKI_layout['\u010cesky'] = {
    'name': "Czech", 'keys': [
      [[";", "\u00b0", "`", "~"], ["+", "1", "!"], ["\u011B", "2", "@"], ["\u0161", "3", "#"], ["\u010D", "4", "$"], ["\u0159", "5", "%"], ["\u017E", "6", "^"], ["\u00FD", "7", "&"], ["\u00E1", "8", "*"], ["\u00ED", "9", "("], ["\u00E9", "0", ")"], ["=", "%", "-", "_"], ["\u00B4", "\u02c7", "=", "+"], ["Bksp", "Bksp"]],
      [["Tab", "Tab"], ["q", "Q"], ["w", "W"], ["e", "E", "\u20AC"], ["r", "R"], ["t", "T"], ["y", "Y"], ["u", "U"], ["i", "I"], ["o", "O"], ["p", "P"], ["\u00FA", "/", "[", "{"], [")", "(", "]", "}"], ["\u00A8", "'", "\\", "|"]],
      [["Caps", "Caps"], ["a", "A"], ["s", "S"], ["d", "D"], ["f", "F"], ["g", "G"], ["h", "H"], ["j", "J"], ["k", "K"], ["l", "L"], ["\u016F", '"', ";", ":"], ["\u00A7", "!", "\u00a4", "^"], ["Enter", "Enter"]],
      [["Shift", "Shift"], ["\\", "|", "", "\u02dd"], ["z", "Z"], ["x", "X"], ["c", "C"], ["v", "V"], ["b", "B"], ["n", "N"], ["m", "M"], [",", "?", "<", "\u00d7"], [".", ":", ">", "\u00f7"], ["-", "_", "/", "?"], ["Shift", "Shift"]],
      [[" ", " ", " ", " "], ["Alt", "Alt"]]
    ], 'lang': ["cs"] };

  this.VKI_layout['\u{2C03}\u{2C3E}\u{2C30}\u{2C33}\u{2C41}\u{2C3E}\u{2C39}\u{2C4C}\u{2C30}'] = {
    'name': "Glagolitic", 'keys': [
      [["\u{A67D}", "\u{A67F}"], ["\u{A67C}", "\u{482}"], ["\u{A66F}", "\u{488}"], ["\u{483}", "\u{489}"], ["\u{485}", "\u{A670}"], ["\u{486}", "\u{A671}"], ["\u{487}", "\u{A672}"], ["\u{484}", "\u{203B}"], ["\u{306}", "\u{A673}"], ["\u{2D8}", "\u{A67E}"], ["\u{B4}", "`"], ["\u{10FB}", "\u{2056}"], ["\u{308}", "\u{2058}"], ["\u{33E}", "\u{2E2F}"], ["Bksp", "Bksp"]],
      [["Tab", "Tab"], ["\u{2C30}", "\u{2C00}", "\u{430}", "\u{410}"], ["\u{2C31}", "\u{2C01}", "\u{431}", "\u{411}"], ["\u{2C32}", "\u{2C02}", "\u{432}", "\u{412}"], ["\u{2C33}", "\u{2C03}", "\u{433}", "\u{413}"], ["\u{2C34}", "\u{2C04}", "\u{434}", "\u{414}"], ["\u{2C35}", "\u{2C05}", "\u{454}", "\u{404}"], ["\u{2C36}", "\u{2C06}", "\u{436}", "\u{416}"], ["\u{2C37}", "\u{2C07}", "\u{455}", "\u{405}"], ["\u{2C38}", "\u{2C08}", "\u{437}", "\u{417}"], ["\u{2C39}", "\u{2C09}", "\u{438}", "\u{418}"], ["\u{2C3A}", "\u{2C0A}", "\u{439}", "\u{419}"], ["\u{2C3B}", "\u{2C0B}", "\u{456}", "\u{406}"], ["\u{2C3C}", "\u{2C0C}", "\u{45B}", "\u{40B}"], ["\u{2059}", "\u{387}"]],
      [["Caps", "Caps"], ["\u{2C3D}", "\u{2C0D}", "\u{43A}", "\u{41A}"], ["\u{2C3E}", "\u{2C0E}", "\u{43B}", "\u{41B}"], ["\u{2C3F}", "\u{2C0F}", "\u{43C}", "\u{41C}"], ["\u{2C40}", "\u{2C10}", "\u{43D}", "\u{41D}"], ["\u{2C41}", "\u{2C11}", "\u{43E}", "\u{41E}"], ["\u{2C42}", "\u{2C12}", "\u{43F}", "\u{41F}"], ["\u{2C43}", "\u{2C13}", "\u{440}", "\u{420}"], ["\u{2C44}", "\u{2C14}", "\u{441}", "\u{421}"], ["\u{2C45}", "\u{2C15}", "\u{442}", "\u{422}"], ["\u{2C46}", "\u{2C16}", "\u{443}", "\u{423}"], ["\u{2C47}", "\u{2C17}", "\u{444}", "\u{424}"], ["\u{2C48}", "\u{2C18}", "\u{445}", "\u{425}"], ["\u{2C49}", "\u{2C19}", "\u{461}", "\u{460}"], [".", ","]],
      [["", ""], ["\u{2C4A}", "\u{2C1A}", "\u{43F}", "\u{41F}"], ["\u{2C4B}", "\u{2C1B}", "\u{449}", "\u{429}"], ["\u{2C4C}", "\u{2C1C}", "\u{446}", "\u{426}"], ["\u{2C4D}", "\u{2C1D}", "\u{447}", "\u{427}"], ["\u{2C4E}", "\u{2C1E}", "\u{448}", "\u{428}"], ["\u{2C4F}", "\u{2C1F}", "\u{44A}", "\u{42A}"], ["\u{2C50}", "\u{2C20}", "\u{44C}", "\u{42C}"], ["\u{2C51}", "\u{2C21}", "\u{463}", "\u{462}"], ["\u{2C52}", "\u{2C22}", "\u{445}", "\u{425}"], ["\u{2C53}", "\u{2C23}", "\u{44E}", "\u{42E}"], ["\u{2C54}", "\u{2C24}", "\u{467}", "\u{466}"], ["Enter", "Enter"]],
      [["Shift", "Shift"], ["\u{2C55}", "\u{2C25}", "\u{46D}", "\u{46C}"], ["\u{2C56}", "\u{2C26}", "\u{451}", "\u{401}"], ["\u{2C57}", "\u{2C27}", "\u{469}", "\u{468}"], ["\u{2C58}", "\u{2C28}", "\u{46B}", "\u{46A}"], ["\u{2C59}", "\u{2C29}", "\u{46D}", "\u{46C}"], ["\u{2C5A}", "\u{2C2A}", "\u{473}", "\u{472}"], ["\u{2C5B}", "\u{2C2B}", "\u{475}", "\u{474}"], ["\u{2C5C}", "\u{2C2C}", "\u{44A}", "\u{42A}"], ["\u{2C5D}", "\u{2C2D}", "\u{430}", "\u{410}"], ["\u{2C5E}", "\u{2C2E}", "\u{43C}", "\u{41C}"], ["Shift", "Shift"]],
      [[" ", " ", " ", " "], ["Alt", "Alt"]]
    ], 'lang': ["glag"] };

  this.VKI_layout['\u041c\u0430\u043a\u0435\u0434\u043e\u043d\u0441\u043a\u0438'] = {
    'name': "Macedonian", 'keys': [
      [["`", "~"], ["1", "!"], ["2", "\u201E"], ["3", "\u201C"], ["4", "\u2019"], ["5", "%"], ["6", "\u2018"], ["7", "&"], ["8", "*"], ["9", "("], ["0", ")"], ["-", "_"], ["=", "+"], ["Bksp", "Bksp"]],
      [["Tab", "Tab"], ["\u0459", "\u0409"], ["\u045A", "\u040A"], ["\u0435", "\u0415", "\u20AC"], ["\u0440", "\u0420"], ["\u0442", "\u0422"], ["\u0455", "\u0405"], ["\u0443", "\u0423"], ["\u0438", "\u0418"], ["\u043E", "\u041E"], ["\u043F", "\u041F"], ["\u0448", "\u0428", "\u0402"], ["\u0453", "\u0403", "\u0452"], ["\u0436", "\u0416"]],
      [["Caps", "Caps"], ["\u0430", "\u0410"], ["\u0441", "\u0421"], ["\u0434", "\u0414"], ["\u0444", "\u0424", "["], ["\u0433", "\u0413", "]"], ["\u0445", "\u0425"], ["\u0458", "\u0408"], ["\u043A", "\u041A"], ["\u043B", "\u041B"], ["\u0447", "\u0427", "\u040B"], ["\u045C", "\u040C", "\u045B"], ["Enter", "Enter"]],
      [["Shift", "Shift"], ["\u0451", "\u0401"], ["\u0437", "\u0417"], ["\u045F", "\u040F"], ["\u0446", "\u0426"], ["\u0432", "\u0412", "@"], ["\u0431", "\u0411", "{"], ["\u043D", "\u041D", "}"], ["\u043C", "\u041C", "\u00A7"], [",", ";"], [".", ":"], ["/", "?"], ["Shift", "Shift"]],
      [[" ", " ", " ", " "], ["AltGr", "AltGr"]]
    ], 'lang': ["mk"] };

  this.VKI_layout['Polski'] = {
    'name': "Polish (214)", 'keys': [
      [["\u02DB", "\u00B7"], ["1", "!", "~"], ["2", '"', "\u02C7"], ["3", "#", "^"], ["4", "\u00A4", "\u02D8"], ["5", "%", "\u00B0"], ["6", "&", "\u02DB"], ["7", "/", "`"], ["8", "(", "\u00B7"], ["9", ")", "\u00B4"], ["0", "=", "\u02DD"], ["+", "?", "\u00A8"], ["'", "*", "\u00B8"], ["Bksp", "Bksp"]],
      [["Tab", "Tab"], ["q", "Q", "\\"], ["w", "W", "\u00A6"], ["e", "E"], ["r", "R"], ["t", "T"], ["z", "Z"], ["u", "U", "\u20AC"], ["i", "I"], ["o", "O"], ["p", "P"], ["\u017C", "\u0144", "\u00F7"], ["\u015B", "\u0107", "\u00D7"], ["\u00F3", "\u017A"]],
      [["Caps", "Caps"], ["a", "A"], ["s", "S", "\u0111"], ["d", "D", "\u0110"], ["f", "F"], ["g", "G"], ["h", "H"], ["j", "J"], ["k", "K"], ["l", "L"], ["\u0142", "\u0141", "$"], ["\u0105", "\u0119", "\u00DF"], ["Enter", "Enter"]],
      [["Shift", "Shift"], ["<", ">"], ["y", "Y"], ["x", "X"], ["c", "C"], ["v", "V", "@"], ["b", "B", "{"], ["n", "N", "}"], ["m", "M", "\u00A7"], [",", ";", "<"], [".", ":", ">"], ["-", "_"], ["Shift", "Shift"]],
      [[" ", " ", " ", " "], ["AltGr", "AltGr"]]
    ]};

  this.VKI_layout['\u0420\u0443\u0441\u0441\u043a\u0438\u0439'] = {
    'name': "Russian", 'keys': [
      [["\u0451", "\u0401", "\u0481", "\u0480"], ["1", "!", "\ua67d", "\uA67F"], ["2", '"', "\ua67c", "\u0482"], ["3", "\u2116", "\ua66f", "\u0488"], ["4", ";", "\u0483", "\u0489"], ["5", "%", "\u0485", "\ua670"], ["6", ":", "\u0486", "\ua671"], ["7", "?", "\u0487", "\ua672"], ["8", "*", "\u0484", "\u203B"], ["9", "(", "\u0306", "\ua673"], ["0", ")", "\u02D8", "\ua67e"], ["-", "_", "\u0308", "\u2058"], ["=", "+", "\u033E", "\u2E2F"], ["Bksp", "Bksp"]],
      [["Tab", "Tab"], ["\u0439", "\u0419", "\u0457", "\u0407"], ["\u0446", "\u0426"], ["\u0443", "\u0423", "\u0479", "\u0478"], ["\u043A", "\u041A", "\ua64b", "\ua64a"], ["\u0435", "\u0415", "\u0465", "\u0464"], ["\u043D", "\u041D", "\u0469", "\u0468"], ["\u0433", "\u0413"], ["\u0448", "\u0428"], ["\u0449", "\u0429", "\u0455", "\u0405"], ["\u0437", "\u0417", "\ua641", "\ua640"], ["\u0445", "\u0425", "\u046D", "\u046C"], ["\u044A", "\u042A", "\uA653", "\uA652"], ["Enter", "Enter"]],
      [["Caps", "Caps"], ["\u0444", "\u0424", "\u0473", "\u0472"], ["\u044B", "\u042B", "\u0477", "\u0476"], ["\u0432", "\u0412", "\u0475", "\u0474"], ["\u0430", "\u0410", "\u0454", "\u0404"], ["\u043F", "\u041F", "\u0467", "\u0466"], ["\u0440", "\u0420"], ["\u043E", "\u041E", "\u0461", "\u0460"], ["\u043B", "\u041B", "\u047B", "\u047A"], ["\u0434", "\u0414", "\ua643", "\ua642"], ["\u0436", "\u0416", "\u046B", "\u046A"], ["\u044D", "\u042D", "\u0463", "\u0462"], ["\\", "/"]],
      [["Shift", "Shift"], ["\u00b4", "`", "\u10FB", "\u2056"], ["\u044F", "\u042F", "\uA657", "\uA656"], ["\u0447", "\u0427", "\u0471", "\u0470"], ["\u0441", "\u0421", "\u046F", "\u046E"], ["\u043C", "\u041C"], ["\u0438", "\u0418", "\u0456", "\u0406"], ["\u0442", "\u0422", "\u047F", "\u047E"], ["\u044C", "\u042C", "\u047D", "\u047C"], ["\u0431", "\u0411"], ["\u044E", "\u042E"], [".", ",", "\u2059", "\u0387"], ["Shift", "Shift"]],
      [[" ", " ", " ", " "], ["\u0462", "\u0462"]]
    ], 'lang': ["ru"] };

  this.VKI_layout['Sloven\u010dina'] = {
    'name': "Slovak", 'keys': [
      [[";", "\u00b0"], ["+", "1", "~"], ["\u013E", "2", "\u02C7"], ["\u0161", "3", "^"], ["\u010D", "4", "\u02D8"], ["\u0165", "5", "\u00B0"], ["\u017E", "6", "\u02DB"], ["\u00FD", "7", "`"], ["\u00E1", "8", "\u02D9"], ["\u00ED", "9", "\u00B4"], ["\u00E9", "0", "\u02DD"], ["=", "%", "\u00A8"], ["\u00B4", "\u02c7", "\u00B8"], ["Bksp", "Bksp"]],
      [["Tab", "Tab"], ["q", "Q", "\\"], ["w", "W", "|"], ["e", "E", "\u20AC"], ["r", "R"], ["t", "T"], ["z", "Z"], ["u", "U"], ["i", "I"], ["o", "O"], ["p", "P", "'"], ["\u00FA", "/", "\u00F7"], ["\u00E4", "(", "\u00D7"], ["\u0148", ")", "\u00A4"]],
      [["Caps", "Caps"], ["a", "A"], ["s", "S", "\u0111"], ["d", "D", "\u0110"], ["f", "F", "["], ["g", "G", "]"], ["h", "H"], ["j", "J"], ["k", "K", "\u0142"], ["l", "L", "\u0141"], ["\u00F4", '"', "$"], ["\u00A7", "!", "\u00DF"], ["Enter", "Enter"]],
      [["Shift", "Shift"], ["&", "*", "<"], ["y", "Y", ">"], ["x", "X", "#"], ["c", "C", "&"], ["v", "V", "@"], ["b", "B", "{"], ["n", "N", "}"], ["m", "M"], [",", "?", "<"], [".", ":", ">"], ["-", "_", "*", ], ["Shift", "Shift"]],
      [[" ", " ", " ", " "], ["AltGr", "AltGr"]]
    ], 'lang': ["sk"] };
    
  this.VKI_layout['Sloven\u0161\u010dina'] = {
    'name': "Slovenian", 'keys': [
      [["\u00B8", "\u00A8"], ["1", "!", "~"], ["2", '"', "\u02C7"], ["3", "#", "^"], ["4", "$", "\u02D8"], ["5", "%", "\u00B0"], ["6", "&", "\u02DB"], ["7", "/", "`"], ["8", "(", "\u02D9"], ["9", ")", "\u00B4"], ["0", "=", "\u02DD"], ["'", "?", "\u00A8"], ["+", "*", "\u00B8"], ["Bksp", "Bksp"]],
      [["Tab", "Tab"], ["q", "Q", "\\"], ["w", "W", "|"], ["e", "E", "\u20AC"], ["r", "R"], ["t", "T"], ["z", "Z"], ["u", "U"], ["i", "I"], ["o", "O"], ["p", "P"], ["\u0161", "\u0160", "\u00F7"], ["\u0111", "\u0110", "\u00D7"], ["\u017E", "\u017D", "\u00A4"]],
      [["Caps", "Caps"], ["a", "A"], ["s", "S"], ["d", "D"], ["f", "F", "["], ["g", "G", "]"], ["h", "H"], ["j", "J"], ["k", "K", "\u0142"], ["l", "L", "\u0141"], ["\u010D", "\u010C"], ["\u0107", "\u0106", "\u00DF"], ["Enter", "Enter"]],
      [["Shift", "Shift"], ["<", ">"], ["y", "Y"], ["x", "X"], ["c", "C"], ["v", "V", "@"], ["b", "B", "{"], ["n", "N", "}"], ["m", "M", "\u00A7"], [",", ";", "<"], [".", ":", ">"], ["-", "_", "\u00A9"], ["Shift", "Shift"]],
      [[" ", " ", " ", " "], ["AltGr", "AltGr"]]
    ], 'lang': ["sl"] };

  this.VKI_layout['\u0421\u0440\u043f\u0441\u043a\u0438'] = {
    'name': "Serbian", 'keys': [
      [["`", "~"], ["1", "!"], ["2", '"'], ["3", "#"], ["4", "$"], ["5", "%"], ["6", "&"], ["7", "/"], ["8", "("], ["9", ")"], ["0", "="], ["'", "?"], ["+", "*"], ["Bksp", "Bksp"]],
      [["Tab", "Tab"], ["\u0459", "\u0409"], ["\u045a", "\u040a"], ["\u0435", "\u0415", "\u20ac"], ["\u0440", "\u0420"], ["\u0442", "\u0422"], ["\u0437", "\u0417"], ["\u0443", "\u0423"], ["\u0438", "\u0418"], ["\u043e", "\u041e"], ["\u043f", "\u041f"], ["\u0448", "\u0428"], ["\u0452", "\u0402"], ["\u0436", "\u0416"]],
      [["Caps", "Caps"], ["\u0430", "\u0410"], ["\u0441", "\u0421"], ["\u0434", "\u0414"], ["\u0444", "\u0424"], ["\u0433", "\u0413"], ["\u0445", "\u0425"], ["\u0458", "\u0408"], ["\u043a", "\u041a"], ["\u043b", "\u041b"], ["\u0447", "\u0427"], ["\u045b", "\u040b"], ["Enter", "Enter"]],
      [["Shift", "Shift"], ["<", ">"], ["\u0455", "\u0405"], ["\u045f", "\u040f"], ["\u0446", "\u0426"], ["\u0432", "\u0412"], ["\u0431", "\u0411"], ["\u043d", "\u041d"], ["\u043c", "\u041c"], [",", ";", "<"], [".", ":", ">"], ["-", "_", "\u00a9"], ["Shift", "Shift"]],
      [[" ", " ", " ", " "], ["AltGr", "AltGr"]]
    ], 'lang': ["sr-Cyrl"] };

  this.VKI_layout['Srpskohrvatski'] = {
    'name': "Serbocroatian", 'keys': this.VKI_layout['Sloven\u0161\u010dina'].keys.slice(0), 'lang': ["sh"]
  };

  this.VKI_layout['\u{421}\u{43B}\u{43E}\u{432}\u{463}\u{43D}\u{44C}\u{441}\u{43A}\u{44A}'] = {
    'name': "Old Cyrillic / Church Slavonic", 'keys': [
      [["\u{481}", "\u{480}", "\u{A67D}", "\u{A67F}"], ["\u{A67C}", "\u{482}", "\u{A67C}", "\u{482}"], ["\u{A66F}", "\u{488}", "\u{A66F}", "\u{488}"], ["\u{483}", "\u{489}", "\u{483}", "\u{489}"], ["\u{485}", "\u{A670}", "\u{485}", "\u{A670}"], ["\u{486}", "\u{A671}", "\u{486}", "\u{A671}"], ["\u{487}", "\u{A672}", "\u{487}", "\u{A672}"], [ "\u{484}", "\u{203B}", "\u{484}", "\u{203B}"], ["\u{306}", "\u{A673}", "\u{306}", "\u{A673}"], ["\u{2D8}", "\u{A67E}", "\u{2D8}", "\u{A67E}"], ["\u{B4}", "`", "\u{B4}", "`"], ["\u{10FB}", "\u{2056}", "\u{10FB}", "\u{2056}"], ["\u{308}", "\u{2058}", "\u{308}", "\u{2058}"],  ["\u{446}", "\u{426}", "\u{45F}", "\u{40F}"], ["\u{44D}", "\u{42D}"], ["Bksp", "Bksp"]],
      [["Tab", "Tab"], ["\u{439}", "\u{419}", "\u{457}", "\u{407}"], ["\u{456}", "\u{406}", "\u{A65F}", "\u{A65E}"], ["\u{443}", "\u{423}", "\u{479}", "\u{478}"], ["\u{43A}", "\u{41A}", "\u{46F}", "\u{46E}"], ["\u{435}", "\u{415}", "\u{465}", "\u{464}"], ["\u{43D}", "\u{41D}", "\u{469}", "\u{468}"], ["\u{433}", "\u{413}", "\u{467}", "\u{466}"], ["\u{448}", "\u{428}"], ["\u{449}", "\u{429}", "\u{455}", "\u{405}"], ["\u{437}", "\u{417}", "\u{A641}", "\u{A640}"], ["\u{445}", "\u{425}", "\u{A643}", "\u{A642}"], ["\u{2059}", "\u{387}", "\u{2059}", "\u{387}"],  [".", ",", ".", ","], ["\u{33E}", "\u{2E2F}", "\u{33E}", "\u{2E2F}"]],
      [["Caps", "Caps"], ["\u{444}", "\u{424}", "\u{473}", "\u{472}"], ["\u{44B}", "\u{42B}", "\u{477}", "\u{476}"], ["\u{432}", "\u{412}", "\u{475}", "\u{474}"], ["\u{44A}", "\u{42A}", "\u{A64B}", "\u{A64A}"], ["\u{430}", "\u{410}", "\u{454}", "\u{404}"], ["\u{43F}", "\u{41F}", "\u{471}", "\u{470}"], ["\u{440}", "\u{420}"], ["\u{43E}", "\u{41E}", "\u{461}", "\u{460}"], ["\u{43B}", "\u{41B}", "\u{47B}", "\u{47A}"], ["\u{434}", "\u{414}", "\u{A649}", "\u{A648}"], ["\u{436}", "\u{416}", "\u{452}", "\u{402}"], ["Enter", "Enter"]],
      [["Shift", "Shift"], ["\u{44F}", "\u{42F}", "\u{A657}", "\u{A656}"], ["\u{447}", "\u{427}", "\u{45B}", "\u{40B}"], ["\u{463}", "\u{462}", "\u{A653}", "\u{A652}"], ["\u{441}", "\u{421}", "\u{46D}", "\u{46C}"], ["\u{43C}", "\u{41C}", "\u{46B}", "\u{46A}"], ["\u{438}", "\u{418}", "\u{2191}", "\u{2191}"], ["\u{442}", "\u{422}", "\u{47F}", "\u{47E}"], ["\u{44C}", "\u{42C}", "\u{47D}", "\u{47C}"], ["\u{431}", "\u{411}"], ["\u{44E}", "\u{42E}"], ["Shift", "Shift"]],
      [[" ", " ", " ", " "], ["AltGr", "AltGr"]]
    ], 'lang': ["chu"] };

  this.VKI_layout['\u0423\u043a\u0440\u0430\u0457\u043d\u0441\u044c\u043a\u0430'] = {
    'name': "Ukrainian", 'keys': [
      [["\u00b4", "~"], ["1", "!"], ["2", '"'], ["3", "\u2116"], ["4", ";"], ["5", "%"], ["6", ":"], ["7", "?"], ["8", "*"], ["9", "("], ["0", ")"], ["-", "_"], ["=", "+"], ["Bksp", "Bksp"]],
      [["Tab", "Tab"], ["\u0439", "\u0419"], ["\u0446", "\u0426"], ["\u0443", "\u0423"], ["\u043A", "\u041A"], ["\u0435", "\u0415"], ["\u043D", "\u041D"], ["\u0433", "\u0413"], ["\u0448", "\u0428"], ["\u0449", "\u0429"], ["\u0437", "\u0417"], ["\u0445", "\u0425"], ["\u0457", "\u0407"], ["\u0491", "\u0490"]],
      [["Caps", "Caps"], ["\u0444", "\u0424"], ["\u0456", "\u0406"], ["\u0432", "\u0412"], ["\u0430", "\u0410"], ["\u043F", "\u041F"], ["\u0440", "\u0420"], ["\u043E", "\u041E"], ["\u043B", "\u041B"], ["\u0434", "\u0414"], ["\u0436", "\u0416"], ["\u0454", "\u0404"], ["Enter", "Enter"]],
      [["Shift", "Shift"], ["\u044F", "\u042F"], ["\u0447", "\u0427"], ["\u0441", "\u0421"], ["\u043C", "\u041C"], ["\u0438", "\u0418"], ["\u0442", "\u0422"], ["\u044C", "\u042C"], ["\u0431", "\u0411"], ["\u044E", "\u042E"], [".", ","], ["Shift", "Shift"]],
      [[" ", " "]]
    ], 'lang': ["uk"] };

   this.VKI_layout['English'] = {
    'name': "English", 'keys': [
      [["`", "~"], ["1", "!", "\u00a1", "\u00b9"], ["2", "@", "\u00b2"], ["3", "#", "\u00b3"], ["4", "$", "\u00a4", "\u00a3"], ["5", "%", "\u20ac"], ["6", "^", "\u00bc"], ["7", "&", "\u00bd"], ["8", "*", "\u00be"], ["9", "(", "\u2018"], ["0", ")", "\u2019"], ["-", "_", "\u00a5"], ["=", "+", "\u00d7", "\u00f7"], ["Bksp", "Bksp"]],
      [["Tab", "Tab"], ["q", "Q", "\u00e4", "\u00c4"], ["w", "W", "\u00e5", "\u00c5"], ["e", "E", "\u00e9", "\u00c9"], ["r", "R", "\u00ae"], ["t", "T", "\u00fe", "\u00de"], ["y", "Y", "\u00fc", "\u00dc"], ["u", "U", "\u00fa", "\u00da"], ["i", "I", "\u00ed", "\u00cd"], ["o", "O", "\u00f3", "\u00d3"], ["p", "P", "\u00f6", "\u00d6"], ["[", "{", "\u00ab"], ["]", "}", "\u00bb"], ["\\", "|", "\u00ac", "\u00a6"]],
      [["Caps", "Caps"], ["a", "A", "\u00e1", "\u00c1"], ["s", "S", "\u00df", "\u00a7"], ["d", "D", "\u00f0", "\u00d0"], ["f", "F"], ["g", "G"], ["h", "H"], ["j", "J"], ["k", "K"], ["l", "L", "\u00f8", "\u00d8"], [";", ":", "\u00b6", "\u00b0"], ["'", '"', "\u00b4", "\u00a8"], ["Enter", "Enter"]],
      [["Shift", "Shift"], ["z", "Z", "\u00e6", "\u00c6"], ["x", "X"], ["c", "C", "\u00a9", "\u00a2"], ["v", "V"], ["b", "B"], ["n", "N", "\u00f1", "\u00d1"], ["m", "M", "\u00b5"], [",", "<", "\u00e7", "\u00c7"], [".", ">"], ["/", "?", "\u00bf"], ["Shift", "Shift"]],
      [[" ", " ", " ", " "], ["Alt", "Alt"]]
    ], 'lang': ["en"] };


  /* ***** Define Dead Keys ************************************** */
  this.VKI_deadkey = {};

  // - Lay out each dead key set as an object of property/value
  //   pairs.  The rows below are wrapped so uppercase letters are
  //   below their lowercase equivalents.
  //
  // - The property name is the letter pressed after the diacritic.
  //   The property value is the letter this key-combo will generate.
  //
  // - Note that if you have created a new keyboard layout and want
  //   it included in the distributed script, PLEASE TELL ME if you
  //   have added additional dead keys to the ones below.

  this.VKI_deadkey['"'] = this.VKI_deadkey['\u00a8'] = this.VKI_deadkey['\u309B'] = { // Umlaut / Diaeresis / Greek Dialytika / Hiragana/Katakana Voiced Sound Mark
    'a': "\u00e4", 'e': "\u00eb", 'i': "\u00ef", 'o': "\u00f6", 'u': "\u00fc", 'y': "\u00ff", '\u03b9': "\u03ca", '\u03c5': "\u03cb", '\u016B': "\u01D6", '\u00FA': "\u01D8", '\u01D4': "\u01DA", '\u00F9': "\u01DC",
    'A': "\u00c4", 'E': "\u00cb", 'I': "\u00cf", 'O': "\u00d6", 'U': "\u00dc", 'Y': "\u0178", '\u0399': "\u03aa", '\u03a5': "\u03ab", '\u016A': "\u01D5", '\u00DA': "\u01D7", '\u01D3': "\u01D9", '\u00D9': "\u01DB",
    '\u304b': "\u304c", '\u304d': "\u304e", '\u304f': "\u3050", '\u3051': "\u3052", '\u3053': "\u3054", '\u305f': "\u3060", '\u3061': "\u3062", '\u3064': "\u3065", '\u3066': "\u3067", '\u3068': "\u3069",
    '\u3055': "\u3056", '\u3057': "\u3058", '\u3059': "\u305a", '\u305b': "\u305c", '\u305d': "\u305e", '\u306f': "\u3070", '\u3072': "\u3073", '\u3075': "\u3076", '\u3078': "\u3079", '\u307b': "\u307c",
    '\u30ab': "\u30ac", '\u30ad': "\u30ae", '\u30af': "\u30b0", '\u30b1': "\u30b2", '\u30b3': "\u30b4", '\u30bf': "\u30c0", '\u30c1': "\u30c2", '\u30c4': "\u30c5", '\u30c6': "\u30c7", '\u30c8': "\u30c9",
    '\u30b5': "\u30b6", '\u30b7': "\u30b8", '\u30b9': "\u30ba", '\u30bb': "\u30bc", '\u30bd': "\u30be", '\u30cf': "\u30d0", '\u30d2': "\u30d3", '\u30d5': "\u30d6", '\u30d8': "\u30d9", '\u30db': "\u30dc"
  };
  this.VKI_deadkey['~'] = { // Tilde / Stroke
    'a': "\u00e3", 'l': "\u0142", 'n': "\u00f1", 'o': "\u00f5",
    'A': "\u00c3", 'L': "\u0141", 'N': "\u00d1", 'O': "\u00d5"
  };
  this.VKI_deadkey['^'] = { // Circumflex
    'a': "\u00e2", 'e': "\u00ea", 'i': "\u00ee", 'o': "\u00f4", 'u': "\u00fb", 'w': "\u0175", 'y': "\u0177",
    'A': "\u00c2", 'E': "\u00ca", 'I': "\u00ce", 'O': "\u00d4", 'U': "\u00db", 'W': "\u0174", 'Y': "\u0176"
  };
  this.VKI_deadkey['\u02c7'] = { // Baltic caron
    'c': "\u010D", 'd': "\u010f", 'e': "\u011b", 's': "\u0161", 'l': "\u013e", 'n': "\u0148", 'r': "\u0159", 't': "\u0165", 'u': "\u01d4", 'z': "\u017E", '\u00fc': "\u01da",
    'C': "\u010C", 'D': "\u010e", 'E': "\u011a", 'S': "\u0160", 'L': "\u013d", 'N': "\u0147", 'R': "\u0158", 'T': "\u0164", 'U': "\u01d3", 'Z': "\u017D", '\u00dc': "\u01d9"
  };
  this.VKI_deadkey['\u02d8'] = { // Romanian and Turkish breve
    'a': "\u0103", 'g': "\u011f",
    'A': "\u0102", 'G': "\u011e"
  };
  this.VKI_deadkey['-'] = this.VKI_deadkey['\u00af'] = { // Macron
    'a': "\u0101", 'e': "\u0113", 'i': "\u012b", 'o': "\u014d", 'u': "\u016B", 'y': "\u0233", '\u00fc': "\u01d6",
    'A': "\u0100", 'E': "\u0112", 'I': "\u012a", 'O': "\u014c", 'U': "\u016A", 'Y': "\u0232", '\u00dc': "\u01d5"
  };
  this.VKI_deadkey['`'] = { // Grave
    'a': "\u00e0", 'e': "\u00e8", 'i': "\u00ec", 'o': "\u00f2", 'u': "\u00f9", '\u00fc': "\u01dc",
    'A': "\u00c0", 'E': "\u00c8", 'I': "\u00cc", 'O': "\u00d2", 'U': "\u00d9", '\u00dc': "\u01db", '\u0404': "\u0404\u0300", '\u0406': "\u0406\u0300", '\u0407': "\u0407\u0300", '\u0410': "\u0410\u0300", '\u0415': "\u0415\u0300", '\u0418': "\u0418\u0300", '\u041E': "\u041E\u0300", '\u0423': "\u0423\u0300", '\u042B': "\u042B\u0300", '\u042D': "\u042D\u0300", '\u042E': "\u042E\u0300", '\u042F': "\u042F\u0300", '\u0430': "\u0430\u0300", '\u0435': "\u0435\u0300", '\u0438': "\u0438\u0300", '\u043E': "\u043E\u0300", '\u0443': "\u0443\u0300", '\u044B': "\u044B\u0300", '\u044D': "\u044D\u0300", '\u044F': "\u044F\u0300", '\u0454': "\u0454\u0300", '\u0456': "\u0456\u0300", '\u0457': "\u0457\u0300", '\u0462': "\u0462\u0300", '\u0463': "\u0463\u0300", '\u0460': "\u0460\u0300", '\u0461': "\u0461\u0300", '\u0464': "\u0464\u0300", '\u0465': "\u0465\u0300", '\u0466': "\u0466\u0300", '\u0467': "\u0467\u0300", '\u0468': "\u0468\u0300", '\u0469': "\u0469\u0300", '\u046A': "\u046A\u0300", '\u046B': "\u046B\u0300", '\u046C': "\u046C\u0300", '\u046D': "\u046D\u0300", '\u0474': "\u0474\u0300", '\u0475': "\u0475\u0300", '\u0478': "\u0478\u0300", '\u0479': "\u0479\u0300", '\u047A': "\u047A\u0300", '\u047B': "\u047B\u0300", '\u047C': "\u047C\u0300", '\u047D': "\u047D\u0300", '\u047E': "\u047E\u0300", '\u047F': "\u047F\u0300", '\u044E': "\u044E\u0300", '\u042E': "\u042E\u0300", '\ua64b': "\ua64b\u0300", '\ua64a': "\ua64a\u0300", '\uA657': "\uA657\u0300", '\uA656': "\uA656\u0300", '\uA653': "\uA653\u0300", '\uA652': "\uA652\u0300", '\u0306': "\u0306\u0300", '\u0483': "\u0483\u0300", '\u0484': "\u0484\u0300", '\u0485': "\u0485\u0300", '\u0486': "\u0486\u0300", '\u02D8': "\u02D8\u0300" 
  };
  this.VKI_deadkey["'"] = this.VKI_deadkey['\u00b4'] = this.VKI_deadkey['\u0384'] = { // Acute / Greek Tonos
    'a': "\u00e1", 'e': "\u00e9", 'i': "\u00ed", 'o': "\u00f3", 'u': "\u00fa", 'y': "\u00fd", '\u03b1': "\u03ac", '\u03b5': "\u03ad", '\u03b7': "\u03ae", '\u03b9': "\u03af", '\u03bf': "\u03cc", '\u03c5': "\u03cd", '\u03c9': "\u03ce", '\u00fc': "\u01d8",
    'A': "\u00c1", 'E': "\u00c9", 'I': "\u00cd", 'O': "\u00d3", 'U': "\u00da", 'Y': "\u00dd", '\u0391': "\u0386", '\u0395': "\u0388", '\u0397': "\u0389", '\u0399': "\u038a", '\u039f': "\u038c", '\u03a5': "\u038e", '\u03a9': "\u038f", '\u00dc': "\u01d7", '\u0435': "\u0435\u0301", '\u0404': "\u0404\u0301", '\u0406': "\u0406\u0301", '\u0407': "\u0407\u0301", '\u0410': "\u0410\u0301", '\u0415': "\u0415\u0301", '\u0418': "\u0418\u0301", '\u041E': "\u041E\u0301", '\u0423': "\u0423\u0301", '\u042B': "\u042B\u0301", '\u042D': "\u042D\u0301", '\u042E': "\u042E\u0301", '\u042F': "\u042F\u0301", '\u0430': "\u0430\u0301", '\u0435': "\u0435\u0301", '\u0438': "\u0438\u0301", '\u043E': "\u043E\u0301", '\u0443': "\u0443\u0301", '\u044B': "\u044B\u0301", '\u044D': "\u044D\u0301", '\u044F': "\u044F\u0301", '\u0454': "\u0454\u0301", '\u0456': "\u0456\u0301", '\u0457': "\u0457\u0301", '\u0462': "\u0462\u0301", '\u0463': "\u0463\u0301", '\u0460': "\u0460\u0301", '\u0461': "\u0461\u0301", '\u0464': "\u0464\u0301", '\u0465': "\u0465\u0301", '\u0466': "\u0466\u0301", '\u0467': "\u0467\u0301", '\u0468': "\u0468\u0301", '\u0469': "\u0469\u0301", '\u046A': "\u046A\u0301", '\u046B': "\u046B\u0301", '\u046C': "\u046C\u0301", '\u046D': "\u046D\u0301", '\u0474': "\u0474\u0301", '\u0475': "\u0475\u0301", '\u0478': "\u0478\u0301", '\u0479': "\u0479\u0301", '\u047A': "\u047A\u0301", '\u047B': "\u047B\u0301", '\u047C': "\u047C\u0301", '\u047D': "\u047D\u0301", '\u047E': "\u047E\u0301", '\u047F': "\u047F\u0301", '\u044E': "\u044E\u0301", '\u042E': "\u042E\u0301", '\ua64b': "\ua64b\u0301", '\ua64a': "\ua64a\u0301", '\uA657': "\uA657\u0301", '\uA656': "\uA656\u0301", '\uA653': "\uA653\u0301", '\uA652': "\uA652\u0301", '\u0306': "\u0306\u0301", '\u0483': "\u0483\u0301", '\u0484': "\u0484\u0301", '\u0485': "\u0485\u0301", '\u0486': "\u0486\u0301", '\u02D8': "\u02D8\u0301"
  };
  this.VKI_deadkey['\u02dd'] = { // Hungarian Double Acute Accent
    'o': "\u0151", 'u': "\u0171",
    'O': "\u0150", 'U': "\u0170"
  };
  this.VKI_deadkey['\u0385'] = { // Greek Dialytika + Tonos
    '\u03b9': "\u0390", '\u03c5': "\u03b0"
  };
  this.VKI_deadkey['\u00b0'] = this.VKI_deadkey['\u00ba'] = { // Ring
    'a': "\u00e5", 'u': "\u016f",
    'A': "\u00c5", 'U': "\u016e"
  };
  this.VKI_deadkey['\u02DB'] = { // Ogonek
    'a': "\u0106", 'e': "\u0119", 'i': "\u012f", 'o': "\u01eb", 'u': "\u0173", 'y': "\u0177",
    'A': "\u0105", 'E': "\u0118", 'I': "\u012e", 'O': "\u01ea", 'U': "\u0172", 'Y': "\u0176"
  };
  this.VKI_deadkey['\u02D9'] = { // Dot-above
    'c': "\u010B", 'e': "\u0117", 'g': "\u0121", 'z': "\u017C",
    'C': "\u010A", 'E': "\u0116", 'G': "\u0120", 'Z': "\u017B"
  };
  this.VKI_deadkey['\u00B8'] = this.VKI_deadkey['\u201a'] = { // Cedilla
    'c': "\u00e7", 's': "\u015F",
    'C': "\u00c7", 'S': "\u015E"
  };
  this.VKI_deadkey[','] = { // Comma
    's': (this.VKI_isIElt8) ? "\u015F" : "\u0219", 't': (this.VKI_isIElt8) ? "\u0163" : "\u021B",
    'S': (this.VKI_isIElt8) ? "\u015E" : "\u0218", 'T': (this.VKI_isIElt8) ? "\u0162" : "\u021A"
  };
  this.VKI_deadkey['\u3002'] = { // Hiragana/Katakana Point
    '\u306f': "\u3071", '\u3072': "\u3074", '\u3075': "\u3077", '\u3078': "\u307a", '\u307b': "\u307d",
    '\u30cf': "\u30d1", '\u30d2': "\u30d4", '\u30d5': "\u30d7", '\u30d8': "\u30da", '\u30db': "\u30dd"
  };

	this.VKI_deadkey[' \u0487'] = { // dasy pneuma
	'\u0391': "\u0386", '\u0395': "\u0388", '\u0397': "\u0389", '\u0399': "\u038a", '\u039f': "\u038c", '\u03a5': "\u038e", '\u03a9': "\u038f", '\u00dc': "\u01d7", '\u0435': "\u0435\u0487", '\u0404': "\u0404\u0487", '\u0406': "\u0406\u0487", '\u0407': "\u0407\u0487", '\u0410': "\u0410\u0487", '\u0415': "\u0415\u0487", '\u0418': "\u0418\u0487", '\u041E': "\u041E\u0487", '\u0423': "\u0423\u0487", '\u042B': "\u042B\u0487", '\u042D': "\u042D\u0487", '\u042E': "\u042E\u0487", '\u042F': "\u042F\u0487", '\u0430': "\u0430\u0487", '\u0435': "\u0435\u0487", '\u0438': "\u0438\u0487", '\u043E': "\u043E\u0487", '\u0443': "\u0443\u0487", '\u044B': "\u044B\u0487", '\u044D': "\u044D\u0487", '\u044F': "\u044F\u0487", '\u0454': "\u0454\u0487", '\u0456': "\u0456\u0487", '\u0457': "\u0457\u0487", '\u0462': "\u0462\u0487", '\u0463': "\u0463\u0487", '\u0460': "\u0460\u0487", '\u0461': "\u0461\u0487", '\u0464': "\u0464\u0487", '\u0465': "\u0465\u0487", '\u0466': "\u0466\u0487", '\u0467': "\u0467\u0487", '\u0468': "\u0468\u0487", '\u0469': "\u0469\u0487", '\u046A': "\u046A\u0487", '\u046B': "\u046B\u0487", '\u046C': "\u046C\u0487", '\u046D': "\u046D\u0487", '\u0474': "\u0474\u0487", '\u0475': "\u0475\u0487", '\u0478': "\u0478\u0487", '\u0479': "\u0479\u0487", '\u047A': "\u047A\u0487", '\u047B': "\u047B\u0487", '\u047C': "\u047C\u0487", '\u047D': "\u047D\u0487", '\u047E': "\u047E\u0487", '\u047F': "\u047F\u0487", '\u044E': "\u044E\u0487", '\u042E': "\u042E\u0487", '\ua64b': "\ua64b\u0487", '\ua64a': "\ua64a\u0487", '\uA657': "\uA657\u0487", '\uA656': "\uA656\u0487", '\uA653': "\uA653\u0487", '\uA652': "\uA652\u0487", '\u0306': "\u0306\u0487", '\u0483': "\u0483\u0487", '\u0484': "\u0484\u0487", '\u0485': "\u0485\u0487", '\u0486': "\u0486\u0487", '\u02D8': "\u02D8\u0487"
  };
  /* ***** Define Symbols **************************************** */
  this.VKI_symbol = {
    '\u00a0': "NB\nSP", '\u200b': "ZW\nSP", '\u200c': "ZW\nNJ", '\u200d': "ZW\nJ"
  };


  /* ***** Layout Number Pad ************************************* */
  this.VKI_numpad = [
    [["$"], ["\u00a3"], ["\u20ac"], ["\u00a5"]],
    [["7"], ["8"], ["9"], ["/"]],
    [["4"], ["5"], ["6"], ["*"]],
    [["1"], ["2"], ["3"], ["-"]],
    [["0"], ["."], ["="], ["+"]]
  ];

  /* ****************************************************************
   * Attach the keyboard to an element
   *
   */
  this.VKI_attachKeyboard = VKI_attach = function(elem) {
    if (elem.getAttribute("VKI_attached")) return false;
    if (this.VKI_imageURI) {
      var keybut = document.createElement('img');
          keybut.src = this.VKI_imageURI;
          keybut.alt = this.VKI_i18n['00'];
          keybut.className = "keyboardInputInitiator";
          keybut.title = this.VKI_i18n['01'];
          keybut.elem = elem;
          keybut.onclick = function(e) {
            e = e || event;
            if (e.stopPropagation) { e.stopPropagation(); } else e.cancelBubble = true;
            self.VKI_show(this.elem);
          };
      elem.parentNode.insertBefore(keybut, (elem.dir == "rtl") ? elem : elem.nextSibling);
    } else elem.onfocus = function() { if (self.VKI_target != this) self.VKI_show(this); };
    elem.setAttribute("VKI_attached", 'true');
    if (this.VKI_isIE) {
      elem.onclick = elem.onselect = elem.onkeyup = function(e) {
        if ((e || event).type != "keyup" || !this.readOnly)
          this.range = document.selection.createRange();
      };
    }
    VKI_addListener(elem, 'click', function(e) {
      if (self.VKI_target == this) {
        e = e || event;
        if (e.stopPropagation) { e.stopPropagation(); } else e.cancelBubble = true;
      } return false;
    }, false);
  };


  /* ***** Find tagged input & textarea elements ***************** */
  var inputElems = [
    document.getElementsByTagName('input'),
    document.getElementsByTagName('textarea')
  ];
  for (var x = 0, elem; elem = inputElems[x++];)
    for (var y = 0, ex; ex = elem[y++];)
      if ((ex.nodeName == "TEXTAREA" || ex.type == "text" || ex.type == "password") && ex.className.indexOf("keyboardInput") > -1)
        this.VKI_attachKeyboard(ex);

  VKI_addListener(document.documentElement, 'click', function(e) { self.VKI_close(); }, false);


  /* ****************************************************************
   * Common mouse event actions
   *
   */
  function VKI_mouseEvents(elem) {
    if (elem.nodeName == "TD") {
      if (!elem.click) elem.click = function() {
        var evt = this.ownerDocument.createEvent('MouseEvents');
        evt.initMouseEvent('click', true, true, this.ownerDocument.defaultView, 1, 0, 0, 0, 0, false, false, false, false, 0, null);
        this.dispatchEvent(evt);
      };
      elem.VKI_clickless = 0;
      VKI_addListener(elem, 'dblclick', function() { return false; }, false);
    }
    VKI_addListener(elem, 'mouseover', function() {
      if (this.nodeName == "TD" && self.VKI_clickless) {
        var _self = this;
        clearTimeout(this.VKI_clickless);
        this.VKI_clickless = setTimeout(function() { _self.click(); }, self.VKI_clickless);
      }
      if (self.VKI_isIE) this.className += " hover";
    }, false);
    VKI_addListener(elem, 'mouseout', function() {
      if (this.nodeName == "TD") clearTimeout(this.VKI_clickless);
      if (self.VKI_isIE) this.className = this.className.replace(/ ?(hover|pressed) ?/g, "");
    }, false);
    VKI_addListener(elem, 'mousedown', function() {
      if (this.nodeName == "TD") clearTimeout(this.VKI_clickless);
      if (self.VKI_isIE) this.className += " pressed";
    }, false);
    VKI_addListener(elem, 'mouseup', function() {
      if (this.nodeName == "TD") clearTimeout(this.VKI_clickless);
      if (self.VKI_isIE) this.className = this.className.replace(/ ?pressed ?/g, "");
    }, false);
  }


  /* ***** Build the keyboard interface ************************** */
  this.VKI_keyboard = document.createElement('table');
  this.VKI_keyboard.id = "keyboardInputMaster";
  this.VKI_keyboard.dir = "ltr";
  this.VKI_keyboard.cellSpacing = "0";
  this.VKI_keyboard.reflow = function() {
    this.style.width = "50px";
    var foo = this.offsetWidth;
    this.style.width = "";
  };
  VKI_addListener(this.VKI_keyboard, 'click', function(e) {
    e = e || event;
    if (e.stopPropagation) { e.stopPropagation(); } else e.cancelBubble = true;
    return false;
  }, false);

  if (!this.VKI_layout[this.VKI_kt])
    return alert('No keyboard named "' + this.VKI_kt + '"');

  var thead = document.createElement('thead');
    var tr = document.createElement('tr');
      var th = document.createElement('th');
          th.colSpan = "2";

        var kbSelect = document.createElement('div');
            kbSelect.title = this.VKI_i18n['02'];
          VKI_addListener(kbSelect, 'click', function() {
            var ol = this.getElementsByTagName('ol')[0];
            if (!ol.style.display) {
                ol.style.display = "block";
              var li = ol.getElementsByTagName('li');
              for (var x = 0, scr = 0; x < li.length; x++) {
                if (VKI_kt == li[x].firstChild.nodeValue) {
                  li[x].className = "selected";
                  scr = li[x].offsetTop - li[x].offsetHeight * 2;
                } else li[x].className = "";
              } setTimeout(function() { ol.scrollTop = scr; }, 0);
            } else ol.style.display = "";
          }, false);
            kbSelect.appendChild(document.createTextNode(this.VKI_kt));
            kbSelect.appendChild(document.createTextNode(this.VKI_isIE6 ? " \u2193" : " \u25be"));
          var ol = document.createElement('ol');
            for (ktype in this.VKI_layout) {
              if (typeof this.VKI_layout[ktype] == "object") {
                if (!this.VKI_layout[ktype].lang) this.VKI_layout[ktype].lang = [];
                var li = document.createElement('li');
                    li.title = this.VKI_layout[ktype].name;
                  VKI_addListener(li, 'click', function(e) {
                    e = e || event;
                    if (e.stopPropagation) { e.stopPropagation(); } else e.cancelBubble = true;
                    this.parentNode.style.display = "";
                    self.VKI_kts = self.VKI_kt = kbSelect.firstChild.nodeValue = this.firstChild.nodeValue;
                    self.VKI_buildKeys();
                    self.VKI_position(true);
                    document.cookie = "vki_bm=" + VKI_kts + "; path=/"; // Bookmarklet adjustment: Set cookie with changed language
                  }, false);
                  VKI_mouseEvents(li);
                    li.appendChild(document.createTextNode(ktype));
                  ol.appendChild(li);
              }
            } kbSelect.appendChild(ol);
          th.appendChild(kbSelect);

        if (this.VKI_numberPad) {
          var span = document.createElement('span');
              span.appendChild(document.createTextNode("#"));
              span.title = this.VKI_i18n['00'];
            VKI_addListener(span, 'click', function() {
              kbNumpad.style.display = (!kbNumpad.style.display) ? "none" : "";
              self.VKI_position(true);
            }, false);
            VKI_mouseEvents(span);
            th.appendChild(span);
        }

        this.VKI_kbsize = function(e) {
          self.VKI_size = Math.min(5, Math.max(1, self.VKI_size));
          self.VKI_keyboard.className = self.VKI_keyboard.className.replace(/ ?keyboardInputSize\d ?/, "");
          if (self.VKI_size != 2) self.VKI_keyboard.className += " keyboardInputSize" + self.VKI_size;
          self.VKI_position(true);
          if (self.VKI_isOpera) self.VKI_keyboard.reflow();
        };
        if (this.VKI_sizeAdj) {
          var small = document.createElement('small');
              small.title = this.VKI_i18n['10'];
            VKI_addListener(small, 'click', function() {
              --self.VKI_size;
              self.VKI_kbsize();
            }, false);
            VKI_mouseEvents(small);
              small.appendChild(document.createTextNode(this.VKI_isIE6 ? "\u2193" : "\u21d3"));
            th.appendChild(small);
          var big = document.createElement('big');
              big.title = this.VKI_i18n['11'];
            VKI_addListener(big, 'click', function() {
              ++self.VKI_size;
              self.VKI_kbsize();
            }, false);
            VKI_mouseEvents(big);
              big.appendChild(document.createTextNode(this.VKI_isIE6 ? "\u2191" : "\u21d1"));
            th.appendChild(big);
        }

        var span = document.createElement('span');
            span.appendChild(document.createTextNode(this.VKI_i18n['07']));
            span.title = this.VKI_i18n['08'];
          VKI_addListener(span, 'click', function() {
            self.VKI_target.value = "";
            self.VKI_target.focus();
            return false;
          }, false);
          VKI_mouseEvents(span);
          th.appendChild(span);

        var strong = document.createElement('strong');
            strong.appendChild(document.createTextNode('X'));
            strong.title = this.VKI_i18n['06'];
          VKI_addListener(strong, 'click', function() { self.VKI_close(); }, false);
          VKI_mouseEvents(strong);
          th.appendChild(strong);

        tr.appendChild(th);
      thead.appendChild(tr);
  this.VKI_keyboard.appendChild(thead);

  var tbody = document.createElement('tbody');
    var tr = document.createElement('tr');
      var td = document.createElement('td');
        var div = document.createElement('div');

        if (this.VKI_deadBox) {
          var label = document.createElement('label');
            var checkbox = document.createElement('input');
                checkbox.type = "checkbox";
                checkbox.title = this.VKI_i18n['03'] + ": " + ((this.VKI_deadkeysOn) ? this.VKI_i18n['04'] : this.VKI_i18n['05']);
                checkbox.defaultChecked = this.VKI_deadkeysOn;
              VKI_addListener(checkbox, 'click', function() {
                this.title = self.VKI_i18n['03'] + ": " + ((this.checked) ? self.VKI_i18n['04'] : self.VKI_i18n['05']);
                self.VKI_modify("");
                return true;
              }, false);
              label.appendChild(checkbox);
                checkbox.checked = this.VKI_deadkeysOn;
            div.appendChild(label);
          this.VKI_deadkeysOn = checkbox;
        } else this.VKI_deadkeysOn.checked = this.VKI_deadkeysOn;

        if (this.VKI_showVersion) {
          var vr = document.createElement('var');
              vr.title = this.VKI_i18n['09'] + " " + this.VKI_version;
              vr.appendChild(document.createTextNode("v" + this.VKI_version));
            div.appendChild(vr);
        } td.appendChild(div);
        tr.appendChild(td);

      var kbNumpad = document.createElement('td');
          kbNumpad.id = "keyboardInputNumpad";
        if (!this.VKI_numberPadOn) kbNumpad.style.display = "none";
        var ntable = document.createElement('table');
            ntable.cellSpacing = "0";
          var ntbody = document.createElement('tbody');
            for (var x = 0; x < this.VKI_numpad.length; x++) {
              var ntr = document.createElement('tr');
                for (var y = 0; y < this.VKI_numpad[x].length; y++) {
                  var ntd = document.createElement('td');
                    VKI_addListener(ntd, 'click', VKI_keyClick, false);
                    VKI_mouseEvents(ntd);
                      ntd.appendChild(document.createTextNode(this.VKI_numpad[x][y]));
                    ntr.appendChild(ntd);
                } ntbody.appendChild(ntr);
            } ntable.appendChild(ntbody);
          kbNumpad.appendChild(ntable);
        tr.appendChild(kbNumpad);
      tbody.appendChild(tr);
  this.VKI_keyboard.appendChild(tbody);

  if (this.VKI_isIE6) {
    this.VKI_iframe = document.createElement('iframe');
    this.VKI_iframe.style.position = "absolute";
    this.VKI_iframe.style.border = "0px none";
    this.VKI_iframe.style.filter = "mask()";
    this.VKI_iframe.style.zIndex = "999999";
    this.VKI_iframe.src = this.VKI_imageURI;
  }


  /* ****************************************************************
   * Private table cell attachment function for generic characters
   *
   */
  function VKI_keyClick() {
    var done = false, character = "\xa0";
    if (this.firstChild.nodeName.toLowerCase() != "small") {
      if ((character = this.firstChild.nodeValue) == "\xa0") return false;
    } else character = this.firstChild.getAttribute('char');
    if (self.VKI_deadkeysOn.checked && self.VKI_dead) {
      if (self.VKI_dead != character) {
        if (character != " ") {
          if (self.VKI_deadkey[self.VKI_dead][character]) {
            self.VKI_insert(self.VKI_deadkey[self.VKI_dead][character]);
            done = true;
          }
        } else {
          self.VKI_insert(self.VKI_dead);
          done = true;
        }
      } else done = true;
    } self.VKI_dead = false;

    if (!done) {
      if (self.VKI_deadkeysOn.checked && self.VKI_deadkey[character]) {
        self.VKI_dead = character;
        this.className += " dead";
        if (self.VKI_shift) self.VKI_modify("Shift");
        if (self.VKI_altgr) self.VKI_modify("AltGr");
      } else self.VKI_insert(character);
    } self.VKI_modify("");
    return false;
  }


  /* ****************************************************************
   * Build or rebuild the keyboard keys
   *
   */
  this.VKI_buildKeys = function() {
    this.VKI_shift = this.VKI_shiftlock = this.VKI_altgr = this.VKI_altgrlock = this.VKI_dead = false;
    var container = this.VKI_keyboard.tBodies[0].getElementsByTagName('div')[0];
    var tables = container.getElementsByTagName('table');
    for (var x = tables.length - 1; x >= 0; x--) container.removeChild(tables[x]);

    for (var x = 0, hasDeadKey = false, lyt; lyt = this.VKI_layout[this.VKI_kt].keys[x++];) {
      var table = document.createElement('table');
          table.cellSpacing = "0";
        if (lyt.length <= this.VKI_keyCenter) table.className = "keyboardInputCenter";
        var tbody = document.createElement('tbody');
          var tr = document.createElement('tr');
            for (var y = 0, lkey; lkey = lyt[y++];) {
              var td = document.createElement('td');
                if (this.VKI_symbol[lkey[0]]) {
                  var text = this.VKI_symbol[lkey[0]].split("\n");
                  var small = document.createElement('small');
                      small.setAttribute('char', lkey[0]);
                  for (var z = 0; z < text.length; z++) {
                    if (z) small.appendChild(document.createElement("br"));
                    small.appendChild(document.createTextNode(text[z]));
                  } td.appendChild(small);
                } else td.appendChild(document.createTextNode(lkey[0] || "\xa0"));

                var className = [];
                if (this.VKI_deadkeysOn.checked)
                  for (key in this.VKI_deadkey)
                    if (key === lkey[0]) { className.push("deadkey"); break; }
                if (lyt.length > this.VKI_keyCenter && y == lyt.length) className.push("last");
                if (lkey[0] == " " || lkey[1] == " ") className.push("space");
                  td.className = className.join(" ");

                switch (lkey[1]) {
                  case "Caps": case "Shift":
                  case "Alt": case "AltGr": case "\u0462":
                    VKI_addListener(td, 'click', (function(type) { return function() { self.VKI_modify(type); return false; }})(lkey[1]), false);
                    break;
                  case "Tab":
                    VKI_addListener(td, 'click', function() { self.VKI_insert("\t"); return false; }, false);
                    break;
                  case "Bksp":
                    VKI_addListener(td, 'click', function() {
                      self.VKI_target.focus();
                      if (self.VKI_target.setSelectionRange && !self.VKI_target.readOnly) {
                        var rng = [self.VKI_target.selectionStart, self.VKI_target.selectionEnd];
                        if (rng[0] < rng[1]) rng[0]++;
                        self.VKI_target.value = self.VKI_target.value.substr(0, rng[0] - 1) + self.VKI_target.value.substr(rng[1]);
                        self.VKI_target.setSelectionRange(rng[0] - 1, rng[0] - 1);
                      } else if (self.VKI_target.createTextRange && !self.VKI_target.readOnly) {
                        try {
                          self.VKI_target.range.select();
                        } catch(e) { self.VKI_target.range = document.selection.createRange(); }
                        if (!self.VKI_target.range.text.length) self.VKI_target.range.moveStart('character', -1);
                        self.VKI_target.range.text = "";
                      } else self.VKI_target.value = self.VKI_target.value.substr(0, self.VKI_target.value.length - 1);
                      if (self.VKI_shift) self.VKI_modify("Shift");
                      if (self.VKI_altgr) self.VKI_modify("AltGr");
                      self.VKI_target.focus();
                      return true;
                    }, false);
                    break;
                  case "Enter":
                    VKI_addListener(td, 'click', function() {
                      if (self.VKI_target.nodeName != "TEXTAREA") {
                        if (self.VKI_target.form) {
                          for (var z = 0, subm = false; z < self.VKI_target.form.elements.length; z++)
                            if (self.VKI_target.form.elements[z].type == "submit") subm = true;
                          if (!subm) self.VKI_target.form.submit();
                        }
                        self.VKI_close();
                      } else self.VKI_insert("\n");
                      return true;
                    }, false);
                    break;
                  default:
                    VKI_addListener(td, 'click', VKI_keyClick, false);

                } VKI_mouseEvents(td);
                tr.appendChild(td);
              for (var z = 0; z < 4; z++)
                if (this.VKI_deadkey[lkey[z] = lkey[z] || ""]) hasDeadKey = true;
            } tbody.appendChild(tr);
          table.appendChild(tbody);
        container.appendChild(table);
    }
    if (this.VKI_deadBox)
      this.VKI_deadkeysOn.style.display = (hasDeadKey) ? "inline" : "none";
    if (this.VKI_isIE6) {
      this.VKI_iframe.style.width = this.VKI_keyboard.offsetWidth + "px";
      this.VKI_iframe.style.height = this.VKI_keyboard.offsetHeight + "px";
    }
  };

  this.VKI_buildKeys();
  VKI_addListener(this.VKI_keyboard, 'selectstart', function() { return false; }, false);
  this.VKI_keyboard.unselectable = "on";
  if (this.VKI_isOpera)
    VKI_addListener(this.VKI_keyboard, 'mousedown', function() { return false; }, false);


  /* ****************************************************************
   * Controls modifier keys
   *
   */
  this.VKI_modify = function(type) {
    switch (type) {
      case "Alt":
      case "AltGr": this.VKI_altgr = !this.VKI_altgr; break;
      case "\u0462": this.VKI_altgr = 0; this.VKI_altgrlock = !this.VKI_altgrlock; break;
      case "Caps": this.VKI_shift = 0; this.VKI_shiftlock = !this.VKI_shiftlock; break;
      case "Shift": this.VKI_shift = !this.VKI_shift; break;
    } var vchar = 0;
    if (!this.VKI_shift != !this.VKI_shiftlock) vchar += 1;
    if (!this.VKI_altgr != !this.VKI_altgrlock) vchar += 2;

    var tables = this.VKI_keyboard.tBodies[0].getElementsByTagName('div')[0].getElementsByTagName('table');
    for (var x = 0; x < tables.length; x++) {
      var tds = tables[x].getElementsByTagName('td');
      for (var y = 0; y < tds.length; y++) {
        var className = [], lkey = this.VKI_layout[this.VKI_kt].keys[x][y];

        switch (lkey[1]) {
          case "Alt":
          case "AltGr":
            if (this.VKI_altgr) className.push("pressed");
            break;
          case "\u0462":
            if (this.VKI_altgrlock) className.push("pressed");
            break;
          case "Shift":
            if (this.VKI_shift) className.push("pressed");
            break;
          case "Caps":
            if (this.VKI_shiftlock) className.push("pressed");
            break;
          case "Tab": case "Enter": case "Bksp": break;
          default:
            if (type) {
              tds[y].removeChild(tds[y].firstChild);
              if (this.VKI_symbol[lkey[vchar]]) {
                var text = this.VKI_symbol[lkey[vchar]].split("\n");
                var small = document.createElement('small');
                    small.setAttribute('char', lkey[vchar]);
                for (var z = 0; z < text.length; z++) {
                  if (z) small.appendChild(document.createElement("br"));
                  small.appendChild(document.createTextNode(text[z]));
                } tds[y].appendChild(small);
              } else tds[y].appendChild(document.createTextNode(lkey[vchar] || "\xa0"));
            }
            if (this.VKI_deadkeysOn.checked) {
              var character = tds[y].firstChild.nodeValue || tds[y].firstChild.className;
              if (this.VKI_dead) {
                if (character == this.VKI_dead) className.push("pressed");
                if (this.VKI_deadkey[this.VKI_dead][character]) className.push("target");
              }
              if (this.VKI_deadkey[character]) className.push("deadkey");
            }
        }

        if (y == tds.length - 1 && tds.length > this.VKI_keyCenter) className.push("last");
        if (lkey[0] == " " || lkey[1] == " ") className.push("space");
        tds[y].className = className.join(" ");
      }
    }
  };


  /* ****************************************************************
   * Insert text at the cursor
   *
   */
  this.VKI_insert = function(text) {
    this.VKI_target.focus();
    if (this.VKI_target.maxLength) this.VKI_target.maxlength = this.VKI_target.maxLength;
    if (typeof this.VKI_target.maxlength == "undefined" ||
        this.VKI_target.maxlength < 0 ||
        this.VKI_target.value.length < this.VKI_target.maxlength) {
      if (this.VKI_target.setSelectionRange && !this.VKI_target.readOnly) {
        var rng = [this.VKI_target.selectionStart, this.VKI_target.selectionEnd];
        this.VKI_target.value = this.VKI_target.value.substr(0, rng[0]) + text + this.VKI_target.value.substr(rng[1]);
        if (text == "\n" && this.VKI_isOpera) rng[0]++;
        this.VKI_target.setSelectionRange(rng[0] + text.length, rng[0] + text.length);
      } else if (this.VKI_target.createTextRange && !this.VKI_target.readOnly) {
        try {
          this.VKI_target.range.select();
        } catch(e) { this.VKI_target.range = document.selection.createRange(); }
        this.VKI_target.range.text = text;
        this.VKI_target.range.collapse(true);
        this.VKI_target.range.select();
      } else this.VKI_target.value += text;
      if (this.VKI_shift) this.VKI_modify("Shift");
      if (this.VKI_altgr) this.VKI_modify("AltGr");
      this.VKI_target.focus();
    } else if (this.VKI_target.createTextRange && this.VKI_target.range)
      this.VKI_target.range.select();
  };


  /* ****************************************************************
   * Show the keyboard interface
   *
   */
  this.VKI_show = function(elem) {
    if (!this.VKI_target) {
      this.VKI_target = elem;
      if (this.VKI_langAdapt && this.VKI_target.lang) {
        var chg = false, sub = [];
        for (ktype in this.VKI_layout) {
          if (typeof this.VKI_layout[ktype] == "object") {
            for (var x = 0; x < this.VKI_layout[ktype].lang.length; x++) {
              if (this.VKI_layout[ktype].lang[x].toLowerCase() == this.VKI_target.lang.toLowerCase()) {
                chg = kbSelect.firstChild.nodeValue = this.VKI_kt = ktype;
                break;
              } else if (this.VKI_layout[ktype].lang[x].toLowerCase().indexOf(this.VKI_target.lang.toLowerCase()) == 0)
                sub.push([this.VKI_layout[ktype].lang[x], ktype]);
            }
          } if (chg) break;
        } if (sub.length) {
          sub.sort(function (a, b) { return a[0].length - b[0].length; });
          chg = kbSelect.firstChild.nodeValue = this.VKI_kt = sub[0][1];
        } if (chg) this.VKI_buildKeys();
      }
      if (this.VKI_isIE) {
        if (!this.VKI_target.range) {
          this.VKI_target.range = this.VKI_target.createTextRange();
          this.VKI_target.range.moveStart('character', this.VKI_target.value.length);
        } this.VKI_target.range.select();
      }
      try { this.VKI_keyboard.parentNode.removeChild(this.VKI_keyboard); } catch (e) {}
      if (this.VKI_clearPasswords && this.VKI_target.type == "password") this.VKI_target.value = "";

      var elem = this.VKI_target;
      this.VKI_target.keyboardPosition = "absolute";
      do {
        if (VKI_getStyle(elem, "position") == "fixed") {
          this.VKI_target.keyboardPosition = "fixed";
          break;
        }
      } while (elem = elem.offsetParent);

      if (this.VKI_isIE6) document.body.appendChild(this.VKI_iframe);
      document.body.appendChild(this.VKI_keyboard);
      this.VKI_keyboard.style.position = this.VKI_target.keyboardPosition;
      if (this.VKI_isOpera) this.VKI_keyboard.reflow();

      this.VKI_position(true);
      if (self.VKI_isMoz || self.VKI_isWebKit) this.VKI_position(true);
      this.VKI_target.blur();
      this.VKI_target.focus();
    } else this.VKI_close();
  };


  /* ****************************************************************
   * Position the keyboard
   *
   */
  this.VKI_position = function(force) {
    if (self.VKI_target) {
      var kPos = VKI_findPos(self.VKI_keyboard), wDim = VKI_innerDimensions(), sDis = VKI_scrollDist();
      var place = false, fudge = self.VKI_target.offsetHeight + 3;
      if (force !== true) {
        if (kPos[1] + self.VKI_keyboard.offsetHeight - sDis[1] - wDim[1] > 0) {
          place = true;
          fudge = -self.VKI_keyboard.offsetHeight - 3;
        } else if (kPos[1] - sDis[1] < 0) place = true;
      }
      if (place || force === true) {
        var iPos = VKI_findPos(self.VKI_target);
        self.VKI_keyboard.style.top = iPos[1] - ((self.VKI_target.keyboardPosition == "fixed" && !self.VKI_isIE && !self.VKI_isMoz) ? sDis[1] : 0) + fudge + "px";
        self.VKI_keyboard.style.left = Math.max(10, Math.min(wDim[0] - self.VKI_keyboard.offsetWidth - 25, iPos[0])) + "px";
        if (self.VKI_isIE6) {
          self.VKI_iframe.style.width = self.VKI_keyboard.offsetWidth + "px";
          self.VKI_iframe.style.height = self.VKI_keyboard.offsetHeight + "px";
          self.VKI_iframe.style.top = self.VKI_keyboard.style.top;
          self.VKI_iframe.style.left = self.VKI_keyboard.style.left;
        }
      }
      if (force === true) self.VKI_position();
    }
  };


  /* ****************************************************************
   * Close the keyboard interface
   *
   */
  this.VKI_close = VKI_close = function() {
    if (this.VKI_target) {
      try {
        this.VKI_keyboard.parentNode.removeChild(this.VKI_keyboard);
        if (this.VKI_isIE6) this.VKI_iframe.parentNode.removeChild(this.VKI_iframe);
      } catch (e) {}
      if (this.VKI_kt != this.VKI_kts) {
        kbSelect.firstChild.nodeValue = this.VKI_kt = this.VKI_kts;
        this.VKI_buildKeys();
      } kbSelect.getElementsByTagName('ol')[0].style.display = "";;
      this.VKI_target.focus();
      if (this.VKI_isIE) {
        setTimeout(function() { self.VKI_target = false; }, 0);
      } else this.VKI_target = false;
    }
  };


  /* ***** Private functions *************************************** */
  function VKI_addListener(elem, type, func, cap) {
    if (elem.addEventListener) {
      elem.addEventListener(type, function(e) { func.call(elem, e); }, cap);
    } else if (elem.attachEvent)
      elem.attachEvent('on' + type, function() { func.call(elem); });
  }

  function VKI_findPos(obj) {
    var curleft = curtop = 0;
    do {
      curleft += obj.offsetLeft;
      curtop += obj.offsetTop;
    } while (obj = obj.offsetParent);
    return [curleft, curtop];
  }

  function VKI_innerDimensions() {
    if (self.innerHeight) {
      return [self.innerWidth, self.innerHeight];
    } else if (document.documentElement && document.documentElement.clientHeight) {
      return [document.documentElement.clientWidth, document.documentElement.clientHeight];
    } else if (document.body)
      return [document.body.clientWidth, document.body.clientHeight];
    return [0, 0];
  }

  function VKI_scrollDist() {
    var html = document.getElementsByTagName('html')[0];
    if (html.scrollTop && document.documentElement.scrollTop) {
      return [html.scrollLeft, html.scrollTop];
    } else if (html.scrollTop || document.documentElement.scrollTop) {
      return [html.scrollLeft + document.documentElement.scrollLeft, html.scrollTop + document.documentElement.scrollTop];
    } else if (document.body.scrollTop)
      return [document.body.scrollLeft, document.body.scrollTop];
    return [0, 0];
  }

  function VKI_getStyle(obj, styleProp) {
    if (obj.currentStyle) {
      var y = obj.currentStyle[styleProp];
    } else if (window.getComputedStyle)
      var y = window.getComputedStyle(obj, null)[styleProp];
    return y;
  }


  VKI_addListener(window, 'resize', this.VKI_position, false);
  VKI_addListener(window, 'scroll', this.VKI_position, false);
  this.VKI_kbsize();
  VKI_addListener(window, 'load', VKI_buildKeyboardInputs, false);
})();
