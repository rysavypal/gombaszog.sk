require 'net/http'
require 'json'
require 'nokogiri'

class ProgramTag < Liquid::Tag

  def render context

    day_l_map = {
      "Monday"    => "hetfo",
      "Tuesday"   => "kedd",
      "Wednesday" => "szerda",
      "Thursday"  => "csutortok",
      "Friday"    => "pentek",
      "Saturday"  => "szombat",
      "Sunday"    => "vasarnap",
    }

    first = 'tab-pane row active'

    data = JSON.parse File.read '_program.json'
    byday = {}
    data.each do |e|
      day = Time.parse(e['start']).to_date.strftime('%A')
      byday[day] = [] if byday[day] == nil
      byday[day] << e
    end
    @html = Nokogiri::HTML::DocumentFragment.parse ""
    Nokogiri::HTML::Builder.with(@html) do |html|
      html.div(:class => 'tab-content program-matrix program') do
        byday.each do |d,l|
          html.div(:class => first, :id => day_l_map[d]) do 
            first = 'tab-pane row'
            html.div(:class => 'col-md-2 visible-md visible-lg')
            html.div(:class => 'col-md-10') do
              l.each do |e|
                e['start'] = Time.parse e['start']
                e['end'] = Time.parse e['end']
                html.div(:class => 'program-pont row') do 
                  html.div(:class => 'row') do
                    html.div(:class => 'col-md-10') do
                      html.div(:class => 'col-md-2 meta') do
                        if e['end'] - e['start'] == 60
                          html.div(:class => 'idopont') { html.text e['start'].strftime('%k:%M') }
                        else
                          html.div(:class => 'idopont') { html.text "#{e['start'].strftime('%k:%M')} - #{e['end'].strftime('%k:%M')}" }
                        end
                        html.div(:class => 'helyszin') { html.text e['location'] }
                        html.div(:class => 'szervezo') { html.text e['partner'] }
                      end
                      html.div(:class => 'col-md-10') do
                        html.h3 { html.text e['name'] }
                        html.p { html << e['description'] }
                      end
                    end
                    html.div(:class => 'col-md-2 visible-lg visible-md') do
                      html.img(:src => e['logo'], :class => 'img-responsive')
                    end
                  end
                end
              end
            end
          end
        end
      end
    end
    @html.to_html
  end
  Liquid::Template.register_tag('dyn_program', self)
end



