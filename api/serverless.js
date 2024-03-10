const fastify = require('fastify')
const getUuid = require('uuid-by-string')
const OpenAI = require("openai")
const dotenv = require("dotenv")
const { AstraDB } = require("@datastax/astra-db-ts")

dotenv.config()

const app = fastify({
  logger: true,
})

const {
  ASTRA_DB_ENDPOINT,
  ASTRA_DB_APPLICATION_TOKEN,
} = process.env

const openai = new OpenAI()

const astraDb = new AstraDB(ASTRA_DB_APPLICATION_TOKEN, ASTRA_DB_ENDPOINT)

const tempVector = [0.008375864,-0.0111927055,-0.0164938,-0.016914628,-0.022059608,0.020688519,-0.01280136,-0.003977517,-0.010853327,-0.0142267505,0.015584265,0.021978157,0.009061408,0.0052977,0.0055692024,0.021611629,0.04558533,-0.019792559,0.016154421,-0.014986958,-0.013941673,0.011640686,0.0001907944,0.0106904255,0.0066043073,0.015475663,0.02512759,-0.013452967,0.007934671,-0.00897317,0.04178429,-0.01948033,-0.0062649287,-0.027598267,-0.02024054,0.0003086224,0.002044756,0.0022415956,0.0094822375,0.007289852,0.02467961,0.021638779,-0.0015170223,-0.010765089,-0.011131617,0.014905508,0.005969669,0.0044594347,-0.017769862,0.0013710895,0.0065500066,0.032824695,-0.011579597,0.0041302373,-0.007955034,0.009034258,0.0036245633,-0.0009553507,0.0055963527,-0.018014215,0.010194933,0.008403013,-0.028670702,0.018842299,-0.01853007,0.0032563375,-0.004099693,-0.008436952,0.0023807408,0.021652354,0.016941778,0.016371623,0.009441513,0.003980911,0.00042655645,-0.0062988666,0.006404074,0.0022229298,-0.0018920356,-0.0034446926,0.009163221,-0.009801254,-0.026661582,-0.0014186025,0.0034328145,-0.0051890984,-0.028046247,-0.0013184858,-0.025874224,-0.00009582142,-0.00967229,0.01696893,0.014321776,0.019358154,-0.0085048275,-0.011172343,0.0009714712,0.02744894,-0.0023434092,-0.041485637,-0.0013566659,-0.00280157,-0.020892145,-0.013432604,0.013215402,0.028725004,0.0057456796,-0.0039198226,0.030734126,0.0016375016,-0.0064923125,0.0062547475,0.015787892,-0.034290813,-0.00659752,-0.010846539,0.0059866384,-0.0086202165,-0.021625204,-0.013853434,0.028779304,0.018462194,0.022113908,-0.005263762,0.023362821,0.019127376,-0.008979958,-0.007364515,-0.001679924,-0.0035465062,0.03114138,-0.0078057074,0.016480224,-0.0022721395,-0.026254328,0.005355394,0.0015713228,0.0072627016,-0.0069911988,-0.017878463,-0.000021847496,0.015774317,-0.009163221,0.008579491,-0.008403013,0.0070998,0.00056167156,0.0082469,0.0071541006,-0.010357834,0.0044594347,-0.01937173,0.023389973,-0.002487645,-0.0095026,0.02932231,-0.021367276,0.013955248,0.0007517236,-0.0012327927,-0.00008887477,0.014050273,0.024204481,-0.029132258,0.020389866,0.032417443,0.0012497617,0.022928417,-0.027652567,-0.0023518936,-0.01092799,0.015339912,-0.0380104,0.021122923,-0.00264885,0.010846539,0.0030459228,0.0009723196,-0.037575997,-0.014131724,-0.02280624,-0.015027684,-0.0018462195,0.027326765,-0.0036585012,-0.0027438758,0.014973383,-0.01662955,0.020417016,-0.007622443,0.023634324,0.029105108,0.010432498,-0.009115709,-0.6898345,-0.026715882,-0.004391559,-0.010758301,0.0005311275,0.000002008432,0.023620749,-0.0029050808,-0.021638779,-0.008789905,-0.008443739,0.0124008935,0.0050126216,0.015611415,-0.018462194,-0.012753847,0.004754694,-0.016086545,0.0015110831,0.0066925455,-0.019493906,0.018638672,0.002616609,-0.005436845,0.021652354,0.0062513533,0.025982825,-0.024109455,-0.0020736032,-0.0011072226,-0.019412454,0.02415018,0.012808148,-0.006285291,0.0470243,-0.00093583646,-0.015638566,0.043277558,0.00012737303,0.017376184,0.002757451,0.01844862,0.0154349385,-0.018068517,-0.016113695,-0.0041607814,0.010751514,0.020417016,-0.015394213,-0.019629657,0.007493479,-0.010710788,0.021122923,0.01705038,0.0006231839,-0.006563582,0.039557967,0.0024689792,-0.007337365,0.015462088,-0.017403334,0.018190691,-0.01377877,-0.015516389,0.0028898087,0.010670063,-0.016955353,0.02412303,0.0016994383,-0.015299187,0.013968823,0.0005603989,-0.0044764034,0.025616296,0.0066925455,0.042680252,0.027123136,-0.02367505,-0.007228764,0.015339912,0.018190691,-0.01570644,-0.023213495,-0.02512759,0.0076020802,-0.0031341612,-0.03904211,-0.01929028,0.019778984,-0.013262915,-0.003532931,0.008314775,-0.0074391784,-0.006522856,-0.00975374,0.017254008,-0.03119568,-0.012095453,0.009536538,-0.02465246,-0.011647473,0.005861068,0.007636018,-0.006319229,0.0013447877,0.013011775,0.00036864998,0.0164395,0.009706227,-0.052372903,0.0031647054,0.004469616,-0.035838377,-0.020023337,0.0024537072,-0.03312335,0.017158981,0.010921203,0.012176904,-0.021421576,0.007995759,0.004174357,0.028887905,0.004272776,0.0048429323,0.009441513,-0.0032223996,-0.026403654,-0.010052394,0.005514902,0.011253794,0.0020193027,0.014416803,-0.0032308842,0.010459648,0.002363772,0.007052287,-0.012950687,0.007873584,-0.009862342,-0.014267475,0.018964475,0.017226856,-0.011464208,-0.016290173,-0.030163968,0.014525403,-0.002345106,-0.016032245,-0.0056404723,-0.019765409,-0.024435258,-0.038553406,0.015747167,0.009516176,-0.01207509,0.0061088144,-0.007982184,-0.013357941,-0.032308843,0.016059395,0.0073780906,-0.02562987,-0.009393999,0.0020023338,-0.029403761,0.0041573877,-0.016453074,-0.018869448,-0.00036377143,0.02182883,-0.019276703,-0.009909854,0.012842085,-0.012495919,-0.012441619,-0.016955353,-0.01280136,0.014919083,-0.0015950793,0.013656594,-0.0021669322,-0.028453501,0.005233218,0.016873904,0.023064168,0.02702811,0.03418221,0.004120056,-0.014240325,-0.014023123,0.0027947826,-0.0019938492,0.014457528,-0.020159088,-0.030924177,-0.0012820027,0.008518402,0.019493906,0.012224416,0.016453074,-0.0012302473,0.015882919,-0.024557434,0.027313188,-0.023294946,0.011708561,-0.020064062,0.0031748866,-0.0039232164,0.016412348,-0.011090892,0.00038434626,0.012149753,0.03798325,0.020892145,0.023580024,0.00054555107,0.008029697,-0.011708561,-0.017240433,0.0034412988,-0.0060273637,0.0018818543,-0.006662002,0.011450633,0.014783331,0.0063769235,0.0011963095,-0.014348927,0.007507054,0.0016018669,0.013066076,0.017172556,-0.0017019836,0.013262915,0.012529857,-0.009332911,0.020159088,-0.0049175955,-0.0072966395,-0.0004269807,0.014891933,0.0031714928,0.011396333,0.015068409,0.0032207028,0.0074866917,0.0047750566,-0.0032851847,-0.0142539,0.0038587346,-0.0051246164,0.02546697,0.0019073077,-0.02652583,-0.006207234,0.015543539,0.004866689,0.024285931,0.032607496,0.001322728,0.006085058,0.009577264,0.009163221,0.0214623,-0.00015781104,0.01073115,0.013995972,-0.022860542,-0.015014108,0.008783118,0.015760742,0.0029084745,-0.0021143286,-0.005430057,-0.0023569842,0.017797014,-0.0050499532,-0.00006045181,0.014538978,-0.023281371,0.03209164,-0.00084378,-0.009061408,-0.008837419,-0.0144711025,0.003563475,0.009679077,0.025114015,-0.008850994,0.022656914,0.019168103,-0.00487687,-0.022100333,-0.0031579176,0.015801467,-0.035621177,0.0068690227,0.0083012,0.0027387852,-0.002217839,-0.0004653729,-0.03138573,0.036245633,-0.040046673,0.00484972,-0.03228169,-0.0007538447,-0.00072754285,-0.0030985265,-0.0068079345,-0.019331004,-0.02406873,0.013452967,-0.010357834,-0.015339912,-0.0082740495,0.03689724,0.010167782,0.0011369182,-0.0072966395,-0.00073348195,0.004435678,0.06271716,0.0067875716,0.010656487,-0.004228657,-0.0067468463,-0.0037297707,-0.023607174,-0.0049379584,-0.00058542803,-0.0089935325,0.015502814,-0.021082198,0.008688092,-0.0028626584,0.012414468,0.008063635,0.01464758,-0.012129391,0.02467961,0.0113080945,0.009489025,-0.0050804974,0.0053587877,0.0071133752,0.002314562,-0.040779732,0.004133631,0.0045273104,0.021014322,-0.011525297,0.0025097046,-0.0064991,-0.004106481,-0.012421256,0.011932551,0.010188146,-0.0011437058,0.0060782703,-0.0021584479,-0.00028762335,0.029512363,0.0014983565,0.0059357313,-0.00004743346,0.0064414055,0.00034595403,0.0046698493,0.030055368,-0.006020576,0.0041947193,0.008355501,0.0006643336,-0.0332048,-0.000037888436,-0.009013895,0.0046969997,-0.00089680793,0.0019090045,0.0023722562,-0.02026769,-0.022453288,-0.013113588,0.002915262,0.0031104048,-0.013731258,-0.005850887,-0.02317277,-0.018244993,-0.00055106595,-0.0018021003,-0.01738976,-0.00038010403,-0.021625204,-0.01472903,0.01696893,0.0025097046,0.0065024938,-0.012618096,0.015611415,0.0060171825,0.0065262504,-0.0018173723,0.008891719,-0.029593812,-0.001757981,-0.001744406,0.014104574,0.015529964,-0.012421256,0.018258568,0.015584265,-0.01858437,0.004659668,-0.01607297,-0.0033853014,-0.0063328044,0.028915055,-0.0023196526,0.0024028004,0.005440239,-0.009835191,-0.0046019736,-0.0053010937,-0.0045680357,0.021503028,0.0046223365,0.0017164072,0.02546697,-0.011552447,-0.013547993,0.012971049,-0.023349246,0.000010890606,-0.001235338,0.00015314459,0.020444166,-0.0046019736,0.012869236,-0.032498892,-0.03130428,-0.011993639,-0.03119568,0.027055262,0.02277909,0.0019870617,0.0020668155,-0.001442359,-0.013995972,0.0018377351,-0.014756181,0.0025402487,0.0024621917,-0.0023654688,-0.0014321776,-0.028209148,-0.017349033,-0.008701667,0.014389652,-0.008932444,-0.016358048,-0.03222739,0.0040657553,0.009814829,-0.023240646,-0.021150073,-0.03019112,-0.02446241,0.011362395,-0.007880371,0.01934458,-0.009183585,0.03214594,-0.003044226,-0.0015933824,-0.011511722,-0.021421576,-0.017091105,-0.013018562,0.017362608,0.011145193,0.011973277,0.0034650553,0.03874346,-0.015869342,-0.01992831,0.001886945,-0.0027998732,-0.0129982,0.012258355,0.022534737,0.0032868816,0.0103306845,0.012081877,0.018109242,-0.007927883,0.017593386,-0.023335671,-0.005202674,0.0018479164,-0.010758301,-0.006913142,-0.012645246,-0.0069199293,-0.0018428257,-0.003865522,-0.017783439,0.021760955,-0.005480964,0.0021906889,0.011328457,0.032471742,-0.008396226,0.042164396,0.0063938927,0.00043122293,-0.024231631,-0.0067264833,0.018543646,0.017688412,0.0027218163,0.00020182421,0.015163436,-0.016901053,0.010880478,-0.011145193,0.027706867,-0.006336198,-0.032390293,0.018190691,-0.03518677,0.0032868816,-0.0141996,-0.019195253,-0.045992587,-0.0072966395,0.0010792239,-0.0063158353,0.0102152955,-0.017362608,-0.00675024,0.015720015,-0.024163755,0.026797334,0.008104361,0.0429246,0.025847074,0.005755861,-0.020661369,0.005114435,-0.030679824,-0.0068961727,0.014756181,0.020064062,-0.0050160154,-0.0025894586,0.0007686925,-0.013643019,-0.0051415856,-0.0235393,0.008131511,0.019914735,0.0013515753,-0.030001067,-0.01375162,-0.018149966,0.007778557,0.0014202994,-0.0048904456,-0.03114138,-0.022059608,-0.022303961,-0.0010130451,-0.007418816,0.018109242,0.005687985,-0.021136498,-0.0011487965,-0.0032071276,0.009685865,0.0021262069,-0.026743032,0.048083156,0.0009680774,0.028209148,0.00050991634,0.013622656,-0.017430484,-0.0049209893,0.0007852372,0.029756714,-0.013683745,-0.020498466,0.015258461,0.010995866,0.023865102,0.0125162825,-0.01937173,-0.0026420623,-0.0033717263,-0.008599853,0.008403013,0.0023569842,-0.011830738,-0.026987385,-0.018435044,-0.0029424124,-0.0212994,-0.00785322,0.00487687,-0.03418221,-0.018299293,-0.007893946,-0.0028236299,-0.0011504934,0.005321456,-0.012292292,0.022534737,0.032661796,-0.025290493,0.0069844113,-0.015027684,0.018692972,-0.0049345647,0.012122603,0.013466543,-0.021964582,0.01646665,-0.029675264,-0.0076088677,-0.018109242,-0.011810374,0.011647473,-0.0007631776,0.013072863,-0.009455088,0.013534418,0.003105314,-0.005216249,-0.010989078,0.018597946,-0.014009548,0.007561355,0.010235658,-0.016317323,-0.0042388383,-0.019588932,0.0014211478,0.0019836677,-0.017308308,0.0038010401,-0.022833392,0.025833499,-0.025901373,-0.023905827,-0.00259964,0.0026912722,-0.023797227,0.013568356,-0.0055658086,0.0018648853,0.0025402487,0.017987065,0.011240219,0.017131831,0.0046019736,-0.023892252,0.008056847,0.007934671,-0.023770075,-0.013744833,-0.009984518,0.026905933,0.003661895,-0.033829257,-0.016670275,0.00067663606,-0.027245313,0.016806027,-0.022534737,0.0056540472,-0.0097130155,-0.0021329944,0.0035906255,0.04354906,-0.00023883767,-0.0033326978,-0.0031460396,0.004361015,0.024638886,0.010323897,0.013452967,-0.0117832245,-0.0075545674,-0.018679397,0.016330898,0.016643126,0.002979744,-0.0012794572,-0.01992831,-0.003044226,-0.0005820343,0.0069335047,-0.00052688527,0.019168103,0.010167782,-0.035485424,-0.0065669757,0.025222616,0.00329876,-0.010534312,0.0071405256,0.019833285,-0.002871143,0.0188966,-0.0073577277,0.003331001,-0.005467389,-0.013425817,-0.015285611,0.013839859,-0.0058983997,0.0056506535,0.005850887,-0.0016850147,-0.003310638,-0.0064312243,0.0003979214,-0.011579597,-0.013079651,-0.00034298448,0.0046834243,-0.01850292,0.013717682,-0.020688519,0.014525403,0.003644926,-0.014661155,-0.01805494,0.018407894,-0.002584368,-0.0062140217,0.010412135,0.019113801,-0.0011504934,-0.0035566876,-0.013133951,-0.002044756,0.0021822043,-0.010860114,0.0037365581,-0.013235765,-0.023471422,0.0022263236,0.033422004,0.008212962,0.013256128,0.24174616,-0.008097573,-0.007289852,0.040453926,0.0131203765,-0.004988865,0.034453712,-0.0037026203,-0.007581718,-0.0018716729,-0.017756287,0.0005107648,0.006468556,-0.0015093862,0.0147154555,-0.012692759,-0.019751834,-0.012217629,-0.011552447,-0.026892358,-0.00019927886,-0.012319443,-0.00757493,-0.0105954,0.035838377,-0.0062581412,-0.012339805,-0.0028236299,0.031630084,0.017267583,-0.0008310533,0.00043737414,0.015910069,0.007982184,-0.0034446926,0.0063938927,0.00077208626,0.0016078061,-0.0030170756,0.014986958,-0.016901053,0.003168099,0.0024163756,0.0014992049,0.011314882,0.022643339,-0.03483382,0.008348714,-0.004802207,0.02649868,-0.030842725,-0.0022908053,0.024435258,0.031874437,-0.019426031,0.015882919,0.012265142,0.01797349,-0.017742712,-0.020417016,0.009074983,0.034670915,-0.056363996,0.0052196425,-0.020145513,0.0041268435,-0.02929516,0.011233431,0.0064515867,0.006662002,0.009943793,-0.0060918457,-0.012176904,-0.0061291773,-0.029186558,-0.030625524,0.020159088,-0.0052535804,0.012366956,0.027883345,-0.01995546,-0.011369183,-0.022181785,-0.0010359532,-0.013575143,-0.044635072,0.00041340553,0.001419451,-0.0144711025,0.024055155,-0.005083891,-0.00849804,-0.010995866,-0.0329333,-0.004564642,-0.016317323,-0.0036890453,0.014416803,0.0048293574,-0.0027506633,-0.028236298,0.014009548,0.012251567,-0.0028915056,-0.027014535,0.013201827,-0.005708348,0.008131511,0.003865522,-0.007364515,-0.008369076,-0.024571009,0.00094856316,0.0016154421,-0.010636125,0.018122816,0.018475771,-0.011016229,0.024869664,-0.021394426,0.012115816,-0.0046834243,0.00919716,-0.0032088244,0.0036075944,-0.018828724,0.0063633486,0.004978684,0.02658013,-0.033069048,0.009685865,-0.035784077,0.024014428,-0.011566022,-0.015041259,0.014131724,0.01738976,-0.00307477,-0.00917001,-0.012882811,0.0018190693,-0.00849804,0.005212855,0.020226963,0.008056847,-0.027611842,0.010527524,-0.008172236,-0.0128895985,-0.013785558,-0.003234278,-0.00617669,-0.002596246,-0.00964514,-0.009292185,-0.015611415,-0.015937218,-0.038064703,0.0016748334,0.006845266,-0.024204481,0.0048700827,0.027095987,-0.011185918,-0.019778984,0.0060782703,-0.17810588,0.019208828,0.021055048,-0.017769862,0.0043678023,0.0020651186,-0.017349033,-0.008511615,-0.0025385518,0.015000533,0.0053486065,-0.008925657,-0.03491527,-0.014634005,-0.0002649274,0.010921203,0.015000533,0.00665182,0.01702323,0.008559128,0.016697427,-0.032824695,0.008029697,0.0014864783,0.009305761,0.011552447,-0.015489238,0.031901587,-0.008131511,0.009916643,-0.019711109,-0.027991945,0.029403761,-0.0008632943,0.01417245,0.020919297,-0.012231205,-0.03703299,-0.0019921523,0.01794634,0.009617989,0.020742819,0.018815149,-0.0030391351,0.00040089095,0.019521056,0.0010486798,0.0070115617,0.036435686,-0.027910495,0.012251567,-0.012129391,0.00019970309,-0.000016253052,0.005884825,0.013765195,0.020077636,0.02087857,0.0048191757,-0.009387212,-0.006611095,-0.01853007,-0.013459755,-0.028833605,0.005440239,-0.018787999,-0.010914415,0.01324934,-0.0332591,0.0070454995,-0.0018733698,0.00051585544,0.0139823975,-0.013663382,-0.012468769,0.0018767635,-0.021163648,0.028643552,-0.005783011,0.002438435,-0.014023123,0.042680252,0.006543219,0.011959702,0.011280945,0.002519886,-0.011932551,0.017756287,-0.013093226,-0.030544072,0.024258781,0.0033768169,-0.011790012,0.0113080945,0.020213388,0.026715882,-0.016873904,-0.015977943,0.024299506,-0.004768269,0.018991625,0.014593279,-0.018679397,0.038499106,0.027177436,0.012373744,-0.002043059,0.01372447,0.0071337377,0.018720122,-0.033422004,-0.00802291,0.024014428,0.020525618,0.0031562208,0.009455088,-0.010839752,-0.0042422325,0.014281051,-0.0016739849,0.071133755,0.0012158238,-0.003502387,0.0070590745,-0.0014406621,-0.027666142,-0.0947545,-0.03586553,0.0106497,0.000109661705,0.012767422,0.014552554,-0.00617669,0.020552767,-0.010860114,0.03029972,0.007031924,-0.04705145,-0.014158875,-0.01224478,0.005942519,0.008348714,-0.006577157,-0.010771876,0.0010240749,0.018285718,0.01853007,0.01372447,0.0043542273,-0.0031748866,-0.010629337,0.00389946,-0.024082305,0.029620962,0.016059395,-0.0027710262,-0.0036517135,-0.015869342,0.019778984,-0.025982825,-0.0283992,-0.007561355,-0.031684384,-0.012407681,0.013867009,-0.03893351,0.0073780906,0.024733912,-0.00437459,-0.0111791305,-0.010310321,0.0024486165,-0.0032240965,0.023132045,0.011918976,-0.010697213,-0.032797545,-0.016032245,-0.027014535,-0.0015085378,0.01604582,-0.010683638,0.010921203,-0.0036245633,-0.013419029,0.0050804974,-0.0069911988,0.005861068,-0.009692652,0.0122719295,0.007493479,0.009536538,-0.03135858,-0.0053010937,0.013310428,-0.015068409,-0.018014215,-0.00020405138,-0.019235978,0.015000533,-0.032308843,-0.0013804224,-0.032308843,-0.014063848,0.021978157,-0.0031799774,-0.0041573877,-0.026987385,0.01855722,-0.020131938,0.013833071,0.019127376,0.0021279037,-0.021136498,0.021285824,-0.011247006,-0.00020320293,0.017620536,0.007934671,-0.020376291,-0.008857781,0.009387212,0.0032105213,0.009522963,0.0012760635,0.01022887,-0.0066178823,-0.009543326,-0.07862723,0.03141288,0.012115816,0.0026352748,0.00194973,0.0018377351,-0.004344046,-0.010466436,-0.013452967,-0.016235871,-0.00036631676,0.0040657553,0.00047173625,0.012129391,-0.015991518,-0.009896279,0.013853434,0.0025758834,-0.010541099,-0.00997773,-0.017091105,0.010317109,0.017742712,0.000033858316,-0.01760696,-0.013296853,-0.0077921324,-0.004534098,-0.028779304,-0.012685971,0.030951327,-0.02462531,-0.007887159,0.03678864,0.003061195,-0.014769756,-0.0051551606,0.01472903,0.009577264,0.0028643552,-0.016358048,-0.0166024,0.019588932,-0.0058135553,-0.017688412,0.0038383717,0.0012947293,-0.0008212962,0.0047343313,0.00877633,0.017158981,0.022521162,-0.005915369,-0.00052646105,-0.00707265,-0.03483382,0.030897027,-0.01763411,-0.014511828,-0.029403761,0.0331505,0.0122855045,0.0043678023,0.0041777506,0.016263021,-0.002979744,0.010581824,0.019073077,0.008599853,-0.039639417,-0.03323195,-0.008613428,0.025276916,0.027326765,0.018787999,-0.0067638154,0.0046698493,-0.011817162,-0.021951007,0.035675477,0.02372935,-0.0004857356,-0.022358261,-0.001980274,0.02739464,0.03130428,0.00034298448,0.01797349,0.005355394,0.006180084,0.010615762,0.011464208,0.014484678,-0.0015908371,-0.011966489,0.01652095,-0.03122283,0.0032529437,0.021611629,0.00997773,-0.00068936276,-0.015529964,0.030598374,-0.015217735,-0.026322203,-0.0029678657,-0.026810909,-0.010439285,-0.012563795,-0.00032453076,0.02924086,0.004435678,0.00852519,0.016711002,-0.011959702,0.009129284,-0.0055556274,-0.022616189,-0.00024011036,0.0014661155,0.026227176,0.0040012733,0.004313502,-0.024245206,0.013181464,0.014783331,0.01280136,-0.03980232,0.0065839444,0.003790859,0.008179024,-0.0033157289,-0.0040148487,-0.0019921523,0.0030866482,0.017213281,-0.014579704,0.020919297,-0.039476518,0.05967633,0.007452754,-0.022263234,0.0041370247,-0.021760955,0.021611629,0.014430378,-0.00079372164,-0.03486097,-0.024109455,0.0069165356,-0.0021516602,0.012305868,-0.0026692126,-0.01749836,-0.007527417,-0.0025792771,0.009054621,-0.0096112015,0.0016901053,0.022589039,-0.011104467,0.024353808,0.0013066075,-0.021150073,-0.009801254,0.004452647,0.0070251366,0.014036698,-0.016765302,0.0059764567,0.0067638154,-0.027991945,-0.019032352,0.019656807,-0.0050804974,-0.0068215095,-0.011050167,0.0075885053,0.01012027,-0.00011008593,0.005416482,-0.015299187,-0.028046247,0.00096383516,-0.0045273104,-0.0052977,-0.022358261,-0.031059928]

/*app.register(require('@fastify/static'), {
  root: path.join(__dirname, '../public')
})*/

// Declare a route
app.post('/api/openai', async function handler (request, reply) {
    const word = request.body.word
    const embedding = await openai.embeddings.create({
      model: "text-embedding-ada-002",
      input: word,
      encoding_format: "float",
    })
    const vector = embedding.data[0]?.embedding
    //console.log(vector)
    const collection = await astraDb.collection("words")
    const uuid = getUuid(word)
    await collection.updateOne(
      { _id: uuid },
      { $set: { text: word, $vector: vector } },
      { upsert: true }
    )
    return { word }
  })

app.post('/api/vectorize', async function handler (request, reply) {
    const word = request.body.word
    const collection = await astraDb.collection("words")
    const uuid = getUuid(word)
    await collection.updateOne(
      { _id: uuid },
      { $set: { text: word, $vector: tempVector } },
      { upsert: true }
    )
    return { word }
  })

export default async (req, res) => {
    await app.ready();
    app.server.emit('request', req, res);
}